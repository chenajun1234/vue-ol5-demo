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
import Point from 'ol/geom/Point.js';
import { Style, Fill, Text } from 'ol/style.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource, TileDebug } from 'ol/source.js';

/*-----------------添加文字标注*/
export default {
    data() {
        return {
            mapObj: null
        }
    },
    mounted() {
        window.vue = this;
        //需要一个vector的layer来放置图标
        var vLayer = new VectorLayer({
            source: new VectorSource()
        })
        this.mapObj = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                }), vLayer
            ],
            view: new View({
                projection: 'EPSG:4326',
                center:  [104.06, 30.67],
                zoom: 10
            })
        });

        // 添加一个多边形
        var anchor = new Feature({
            geometry: new Point([104.06, 30.67])
        });
        anchor.name = '文字标注';
        // 设置样式，在样式中就可以设置图标
        anchor.setStyle(new Style({
             text: new Text({
                font:'16px',
                text: '海内存知己',
                fill: new Fill({
                  color: 'red'
                })
              })

        }));
        // 添加到之前的创建的layer中去
        vLayer.getSource().addFeature(anchor);


    },
    methods: {}
}
</script>