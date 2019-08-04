<template>
    <div id='mapDIV'>
        <div id="map" class="map"></div>
    </div>
</template>
<script>
import 'ol/ol.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Feature from 'ol/Feature.js';
import GeoJSON from 'ol/format/GeoJSON';
import { Style,Stroke } from 'ol/style.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource, TileDebug } from 'ol/source.js';

/*常用事件*/
export default {    
    data() {
        return {
            mapObj: null,
            infoText:'缺省'
        }
    },
    mounted() {
        window.vue = this
        var vectLayer=new VectorLayer({
            source:new VectorSource({
                format:new GeoJSON(),
                url:'http://localhost:8080/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&typeNames=nyc_roads:nyc_roads&outputFormat=application/json&srsname=EPSG:4326'
            }),
            style:new Style({
                stroke:new Stroke({
                    color:'red',
                    width: 1
                })
            })
        });
        this.mapObj = new Map({
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                vectLayer
            ],
            target: 'map',
            view: new View({
                center:[-73.99710639567148, 40.742270050255556],
                maxZoom: 19,
                zoom: 14,
                projection: 'EPSG:4326'
            })
        });      
    },
    methods: {}
}
</script>