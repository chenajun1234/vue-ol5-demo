<template>
    <div id="map" class="map"></div>
</template>
<script>
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import { Map, View } from 'ol';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Vector as VectorSource, Stamen } from 'ol/source';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

import Renderer from 'ol/renderer/webgl/PointsLayer';
import { clamp } from 'ol/math';
const color = [1, 0, 0, 0.5];
class CustomLayer extends VectorLayer {
    createRenderer() {
        return new Renderer(this, {
            colorCallback: function(feature, vertex, component) {
                return color[component];
            },
            sizeCallback: function(feature) {
                return 18 * clamp(feature.get('mass') / 200000, 0, 1) + 8;
            }
        });
    }
}

export default {
    name: 'WebGLDemo',
    data() {
        return {
            countries: [], //geoJson对象  
            mapObj: null,
            mapSource: null

        }
    },
    created() {
        this.mapSource = new VectorSource();



        this.$ajax.get("http://localhost:9999/src/static/data/meteorites.csv")
            .then(res => {
                debugger;
                const csv = res.data;
                const features = [];
                let prevIndex = csv.indexOf('\n') + 1; // scan past the header line
                let curIndex;
                while ((curIndex = csv.indexOf('\n', prevIndex)) != -1) {
                    const line = csv.substr(prevIndex, curIndex - prevIndex).split(',');
                    prevIndex = curIndex + 1;
                    const coords = fromLonLat([parseFloat(line[4]), parseFloat(line[3])]);
                    if (isNaN(coords[0]) || isNaN(coords[1])) {
                        // guard against bad data
                        continue;
                    }
                    features.push(new Feature({
                        mass: parseFloat(line[1]) || 0,
                        year: parseInt(line[2]) || 0,
                        geometry: new Point(coords)
                    }));
                }
                console.log('prevIndex==' + prevIndex);
                this.mapSource.addFeatures(features);
            }).catch(err => {
                console.log(err);
            });
    },
    mounted() {
        window.vue = this;
        this.mapObj = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new Stamen({ layer: 'toner' })
                }),
                new CustomLayer({
                    source: this.mapSource
                })
            ],
            view: new View({
                center: [31.8797296333, 106.2118975625],
                zoom: 3
            })
        })
    }
}
</script>