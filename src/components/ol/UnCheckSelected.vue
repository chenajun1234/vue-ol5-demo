<template>
    <div id='mapDIV'>
        <!--注意：需要设置tabindex，才能使div获得键盘事件-->
        <div id="map" class="map"></div>
        <button type="" @click='unselectFeature'>取消选中</button>
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
import { transform } from 'ol/proj.js'
import Select from 'ol/interaction/Select.js';
import { pointerMove } from 'ol/events/condition.js';


/**选中feature */
export default {
    data() {
        return {
            mapObj: null,
            selectSingleClick: null
        }
    },
    mounted() {
        window.vue = this
        var layers = new VectorLayer({
            source: new VectorSource(),
            style: new Style({
                //图像样式。
                image: new Circle({
                    radius: 20, //并设置为半径为100像素的圆，用红色填充
                    fill: new Fill({
                        color: "red"
                    })
                })
            })
        })
        let circle = new Feature({
            geometry: new Point(
                transform([104, 30], 'EPSG:4326', 'EPSG:3857')
            )
        })
        layers.getSource().addFeature(circle);
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

        // 添加一个用于选择Feature的交互方式
        //选中Circle后改变颜色 不选中状态恢复原样
        this.selectSingleClick = new Select({
            style: new Style({
                image: new Circle({
                    radius: 20,
                    fill: new Fill({
                        color: 'blue'
                    })
                })
            })
        });
        this.mapObj.addInteraction(this.selectSingleClick);
    },
    methods: {
        unselectFeature() {
            //手动取消选中
            this.selectSingleClick.getFeatures().clear();
            // 也是可以取消选中的，根据情况选择
            //  this.mapObj..removeInteraction( this.selectSingleClick);
        }
    }
}
</script>