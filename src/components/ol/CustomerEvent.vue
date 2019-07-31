<template>
    <div id='mapDIV'>
        <!--注意：需要设置tabindex，才能使div获得键盘事件-->
        <div id="map" class="map"  tabindex="0"></div>
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
            geometry:new Point([0,0]), //原点
            name:'feature1'
        });
        feature1.setStyle(new Style({
            //图像样式。
            image:new Circle({
                radius:100, //并设置为半径为100像素的圆，用红色填充
                fill:new Fill({
                    color:"red"
                })
            })
        }));
        //在坐标[5000000, 5000000]处创建另一个feature
         var feature2  = new Feature({
            geometry:new Point([5000000,5000000]) ,
            name:'feature2'
        });
         // 并设置为半径为100像素的圆，用黄色填充
        feature2.setStyle(new Style({
            image: new Circle({
                radius: 100,
                fill: new Fill({
                    color: 'yellow'
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
                        features: [feature1, feature2]
                    })
                })
            ],           
            view: new View({
                center:[0,0],
                zoom: 2
            })
        });       
      
        // 为地图注册鼠标移动事件的监听
      this.mapObj.on('pointermove', function(event){
          window.vue.mapObj.forEachFeatureAtPixel(event.pixel, function(feature){
              // window.vue.infoText='为移动到的feature发送自定义的mousemove消息';
              // 为移动到的feature发送自定义的mousemove消息
              feature.dispatchEvent({type: 'mousemove', event: event});
          });
      });

      // 为feature1注册自定义事件mousemove的监听
      feature1.on('mousemove', function(event){
          var fillColor=this.getStyle().getImage().getFill().getColor().toString();
          // 修改feature的样式为半径100像素的园，用蓝色填充
          this.setStyle(new Style({
                image: new Circle({
                    radius: 100,
                    fill: new Fill({
                        color:fillColor=='blue'?'red':'blue'
                    })
                })
            }));
      });
    },
    methods: {}
}
</script>