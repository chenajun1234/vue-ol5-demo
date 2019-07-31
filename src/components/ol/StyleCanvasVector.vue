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
import { Style, Icon, Fill, RegularShape, Stroke } from 'ol/style.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource, TileDebug } from 'ol/source.js';
import { transform } from 'ol/proj.js'


export default {
    data() {
        return {
            mapObj: null
        }
    },
    mounted() {
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
                center: [104, 30],
                zoom: 10
            })
        });

        // 添加一个多边形
        var shape = new Feature({
            geometry: new Point([104, 30])
        });
        // 使用canvas绘制一个不规则几何图形
        var canvas = document.createElement('canvas');
        canvas.width = 20;
        canvas.height = 20;
        var context = canvas.getContext("2d");
        context.strokeStyle = "blue";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(0, 0);//(x,y)定义线条开始坐标
        context.lineTo(20, 10);//(x,y)定义线条结束坐标
        context.lineTo(0, 20);
        context.lineTo(10, 10);
        context.lineTo(0, 0);
        context.stroke();

        // 设置样式，在样式中就可以设置图标
        shape.setStyle(new Style({
            image: new Icon({
                img: canvas,
                imgSize: [canvas.width, canvas.height],
                rotation: 90 * Math.PI / 180
            })

        }));
        // 添加到之前的创建的layer中去
        vLayer.getSource().addFeature(shape);


    },
    methods: {}
}
</script>