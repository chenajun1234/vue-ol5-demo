<template>
    <div id='mapDIV'>
        <!--注意：需要设置tabindex，才能使div获得键盘事件-->
        <div id="map" class="map"></div>
    </div>
</template>
<script>
import 'ol/ol.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { Style, Fill, Stroke } from 'ol/style.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource, TileDebug } from 'ol/source.js';
import { transform } from 'ol/proj.js'
import Select from 'ol/interaction/Select.js';
import { pointerMove } from 'ol/events/condition.js';
import { Draw } from 'ol/interaction.js';
import  {defaults as defaultControls,OverviewMap,FullScreen,MousePosition,ScaleLine,ZoomSlider,ZoomToExtent} from 'ol/control.js';

/**限制绘画 */
export default {
    data() {
        return {
            mapObj: null
        }
    },
    mounted() {
        window.vue = this
      
        this.mapObj = new Map({
            target: 'map',
             controls: defaultControls().extend([
                    new FullScreen(),//最大化
                    new MousePosition(),//显示鼠标位置
                    new OverviewMap(),//缩略图
                    new ScaleLine(),//比例尺
                    new ZoomSlider(),//缩放滚动条
                    new ZoomToExtent()//一个按钮控件，当按下该按钮时，会将地图视图更改为特定范围。要设置此控件的样式，请使用css选择器.ol-zoom-extent。
            ]),
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: transform([104, 30], 'EPSG:4326', 'EPSG:3857'),
                zoom: 10
            })
        });      

    },
    methods: {}
}
</script>
<style type="text/css" media="screen">
/* 修改控件样式 */
.ol-zoom .ol-zoom-in {
    background-color: #0000ff !important;
    color: #ff0000 !important;
}
    
</style>