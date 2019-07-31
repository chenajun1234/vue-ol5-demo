<template>
    <div id='mapDIV'>
        <div id="map" class="map"></div>
        <div ref='info'>{{infoText}}</div>
    </div>
</template>
<script>
import 'ol/ol.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { Style, Icon, Fill } from 'ol/style.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource, TileDebug } from 'ol/source.js';
import { transform } from 'ol/proj.js'

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
        this.mapObj = new Map({
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            target: 'map',
            view: new View({
                center: transform(
                    [104, 30], 'EPSG:4326', 'EPSG:3857'),
                zoom: 10
            })
        });


        // 监听singleclick事件
       /* this.mapObj.on('singleclick', function(event) {
            // 通过getEventCoordinate方法获取地理位置，再转换为wgs84坐标，并弹出对话框显示
            alert(transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
           
        })*/
        // 创建事件监听器
       /* var singleclickListener = function(event) {
          alert(transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
            alert('下面将注销该点击事件');
            // 在响应一次后，注销掉该监听器
            window.vue.mapObj.un('singleclick', singleclickListener);
        };
        window.vue.mapObj.on('singleclick', singleclickListener);
        */
         // 使用once函数，只会响应一次事件，之后自动注销事件监听
       /* window.vue.mapObj.once('singleclick', function(event){
            alert('只会响应一次事件。');
        })*/
        this.mapObj.on('click', function(event) {
            // 通过getEventCoordinate方法获取地理位置，再转换为wgs84坐标，并弹出对话框显示
             window.vue.infoText='点击事件:位置:'+transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
        })
      
        //拖动指针时触发
        /*this.mapObj.on('pointerdrag', function(event) {
            window.vue.infoText='拖拽事件：pointerdrag'+transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');       
       })*/
          //移动指针时触发。请注意，在触摸设备上，这是在平移地图时触发的，因此与mousemove不同。
        /*this.mapObj.on('pointermove', function(event) {
           window.vue.infoText='鼠标移动事件：pointermove;位置:'+transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');      
        })*/
        this.mapObj.on('moveend', function(event) {
            window.vue.infoText='地图移动事件：moveend;位置:'/*+transform(event.coordinate, 'EPSG:3857', 'EPSG:4326')*/;    
       })
    },
    methods: {}
}
</script>