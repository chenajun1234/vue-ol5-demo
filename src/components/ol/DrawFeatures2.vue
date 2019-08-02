<template>
    <div id='mapDIV'>
        <!--注意：需要设置tabindex，才能使div获得键盘事件-->
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
import { Style, Fill, Stroke } from 'ol/style.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource, TileDebug } from 'ol/source.js';
import { transform } from 'ol/proj.js'
import Select from 'ol/interaction/Select.js';
import { pointerMove } from 'ol/events/condition.js';
import { Draw } from 'ol/interaction.js';

/**限制绘画 */
export default {
    data() {
        return {
            mapObj: null,
            infoText: '缺省'
        }
    },
    mounted() {
        window.vue = this
        //添加一个绘制的线使用的layer
        var layers = new VectorLayer({
            source: new VectorSource(),
            style: new Style({
                stroke: new Stroke({
                    size: 1,
                    olor: "red"
                })
            })
        })

        this.mapObj = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                layers
            ],
            view: new View({
                center: transform([104, 30], 'EPSG:4326', 'EPSG:3857'),
                zoom: 10
            })
        });
        var lineDraw = new Draw({
            type: 'LineString',
            source: layers.getSource(), // 注意设置source，这样绘制好的线，就会添加到这个source里
            style: new Style({ // 设置绘制时的样式
                stroke: new Stroke({
                    color: '#009933',
                    size: 1
                })
            }),
            maxPoints: 4 // 限制不超过4个点
        });
        ///监听线绘制结束事件，获取坐标
        lineDraw.on('drawend', function(event) {
            debugger;
            // event.feature 就是当前绘制完成的线的Feature
            window.vue.infoText = JSON.stringify(event.feature.getGeometry().getCoordinates());
        })
        this.mapObj.addInteraction(lineDraw);

    },
    methods: {}
}
</script>