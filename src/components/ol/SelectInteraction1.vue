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

/**自定义事件*/
export default {
    data() {
        return {
            mapObj: null,
            infoText:'缺省'
        }
    },
    mounted() {
        window.vue = this
         var feature1 = new Feature({
            geometry:new Point(transform([104, 30], 'EPSG:4326', 'EPSG:3857'))
        });
        feature1.setStyle(new Style({
            //图像样式。
            image:new Circle({
                radius:20, //并设置为半径为100像素的圆，用红色填充
                fill:new Fill({
                    color:"red"
                })
            })
        }));
      
        this.mapObj = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                new VectorLayer({
                    source:new VectorSource({
                        features: [feature1]
                    })
                })
            ],           
            view: new View({
                center: transform([104, 30], 'EPSG:4326', 'EPSG:3857'),
                zoom: 10
            })
        });       
       
            // 添加一个用于选择Feature的交互方式
            var selectSingleClick = new Select({
                // API文档里面有说明，可以设置style参数，用来设置选中后的样式，但没作用，为什么？ 
                // style:new Style({
                //     image: new Circle({
                //         radius: 20,
                //         fill: new Fill({
                //             color: 'blue'
                //         })
                //     })
                // })
            });
            this.mapObj.addInteraction(selectSingleClick);
            // 监听选中事件，然后在事件处理函数中改变被选中的`feature`的样式
            selectSingleClick.on('select', function(event){
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
            })

            /**
            为什么在select里面设置style参数了没用？ 因为circle本身就设置了样式，
            而style参数设置的样式，其实是设置在内部新建的一个layer上的，而OpenLayers 中，
            feature的样式优先级是大于layer的样式的优先级的。所以没生效 
            解决方案:查看SelectInteraction2
            */
    },
    methods: {}
}
</script>