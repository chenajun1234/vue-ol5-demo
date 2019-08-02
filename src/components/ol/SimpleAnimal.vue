<template>
    <div id='mapDIV'>
        <!--注意：需要设置tabindex，才能使div获得键盘事件-->
        <div id="map" class="map"></div>
        <button type="" @click='backNoAnim'>不带动画</button>
        <button type="" @click='backWithAnim'>动画移动</button>
    </div>
</template>
<script>
import 'ol/ol.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { Style, Icon, Fill, Circle } from 'ol/style.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource, TileDebug } from 'ol/source.js';
import Select from 'ol/interaction/Select.js';
import { pointerMove } from 'ol/events/condition.js';
import  { pan } from  'ol/interaction/Interaction.js';
import {fromLonLat} from 'ol/proj.js';
// import { pan } from 'ol/animation.js';

/**简单动画 */
export default {
    data() {
        return {
            mapObj: null,
            lonlat:fromLonLat([104, 30])//成都坐标
        }
    },
    mounted() {
        window.vue = this
       
        this.mapObj = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: window.vue.lonlat,
                zoom: 10
            })
        });
    },
    methods: {
         backNoAnim() {
            this.mapObj.getView().setCenter(window.vue.lonlat);
        },
        backWithAnim() {
              window.vue.mapObj.getView().animate({
                  center: window.vue.lonlat,
                  duration: 2000
                });
            //5.0之后 改方法以及删除了改用  view.animal
            // 注意： 应用内置的动画，实现平移动画
           // pan(window.vue.mapObj.getView(),window.vue.lonlat,2000);  // 注意： 使用beforeRender来添加
       //  this.mapObj.beforeRender(pan);
        // 然后才是重新设置地图中心点到原来的位置
       //  this.mapObj.getView().setCenter(transform([104, 30], 'EPSG:4326', 'EPSG:3857'));
        }
    }
}
</script>