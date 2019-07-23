<template>
    <div>
        <div id="map" class="map"></div>
    </div>
</template>
<script>
import 'ol/ol.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { Draw, Snap } from 'ol/interaction.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource, TileDebug } from 'ol/source.js';
import { transform } from 'ol/proj.js'


export default {
    data() {
        return {

        }
    },
    name: 'LOD',
    mounted() {
        var osmSource = new OSM();
        window.vue = this;
        let raster = new TileLayer({
            source: osmSource
        });
        let tileDebug = new TileLayer({
            source: new TileDebug({
                projection: 'EPSG:3857',
                tileGrid: osmSource.getTileGrid()
            })

        });
        this.mapObj = new Map({
            target: 'map',
            layers: [raster, tileDebug],
            view: new View({
                center: new transform([104, 30], 'EPSG:4326', 'EPSG:3857'),
                zoom: 10
            })
        });

    },
    methods: {}
}
</script>