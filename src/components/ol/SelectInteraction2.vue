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
import { Style, Icon, Fill ,Circle} from 'ol/style.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource, TileDebug } from 'ol/source.js';
import { transform } from 'ol/proj.js'
 import Select from 'ol/interaction/Select.js';

/**选中feature */
export default {
    data() {
        return {
            mapObj: null,
            infoText:'缺省'
        }
    },
    mounted() {
        window.vue = this
        var layers=new VectorLayer({
            source:new VectorSource(),
             style:new Style({
                    //图像样式。
                    image:new Circle({
                        radius:20, //并设置为半径为100像素的圆，用红色填充
                        fill:new Fill({
                            color:"red"
                        })
                    })
                })
        })        
        let circle = new Feature({
            geometry:new Point(
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
            var selectSingleClick = new Select({
                style:new Style({
                    image: new Circle({
                        radius: 20,
                        fill: new Fill({
                            color: 'blue'
                        })
                    })
                })
            });
            this.mapObj.addInteraction(selectSingleClick);
            // 监听选中事件，然后在事件处理函数中改变被选中的`feature`的样式
         /*   selectSingleClick.on('select', function(event){
                let selectFeature=event.selected[0];
                if(!selectFeature){
                    return;
                }
               var fillColor= selectFeature.getStyle().getImage().getFill().getColor();
                selectFeature.setStyle(new Style({
                    image: new Circle({
                        radius: 20,
                        fill: new Fill({
                            color:fillColor=='blue'?'red':'blue'
                        })
                    })
                }));
            })*/
    },
    methods: {}
}
</script>