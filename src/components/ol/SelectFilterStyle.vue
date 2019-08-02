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
import { Style, Icon, Fill, Circle, RegularShape } from 'ol/style.js';
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
            infoText: '缺省'
        }
    },
    mounted() {
        window.vue = this
        // 创建一个用于存放circle的layer
        var circleLayers = new VectorLayer({
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
        //创建一个圆
        let circle = new Feature({
            geometry: new Point(
                transform([104, 30], 'EPSG:4326', 'EPSG:3857')
            )
        })

        circleLayers.getSource().addFeature(circle);
        // 创建一个用于存放star的layer
        var starLayer = new VectorLayer({
            source: new VectorSource(),
            style: new Style({
                //图像样式。
                image: new RegularShape({
                    points: 5,
                    radius1: 20,
                    radius2: 10,
                    fill: new Fill({
                        color: "red"
                    })
                })
            })
        })
        //创建一个五角星
        let star = new Feature({
            geometry: new Point(
                transform([104.06, 30.05], 'EPSG:4326', 'EPSG:3857')
            )
        })
        starLayer.getSource().addFeature(star);

        this.mapObj = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                circleLayers, starLayer
            ],
            view: new View({
                center: transform([104, 30], 'EPSG:4326', 'EPSG:3857'),
                zoom: 10
            })
        });

        // 添加一个用于选择Feature的交互方式
        //选中Circle后改变颜色 不选中状态恢复原样
        var selectSingleClick = new Select({
            condition: pointerMove, // 唯一的不同之处，设置鼠标移到feature上就选取 
            style: new Style({
                image: new Circle({
                    radius: 20,
                    fill: new Fill({
                        color: 'blue'
                    })
                })
            }),
            // 关键： 设置过了条件，可以用feature来写过滤，也可以用layer来写过滤
            filter: function(feature, layer) {
                return layer === circleLayers;
            }
        });
        this.mapObj.addInteraction(selectSingleClick);

    },
    methods: {}
}
</script>