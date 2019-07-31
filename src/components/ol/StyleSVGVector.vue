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
import {Style ,Icon,Fill}from 'ol/style.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource, TileDebug } from 'ol/source.js';
import { transform } from 'ol/proj.js'


export default {
    data() {
        return {
           mapObj:null 
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
                }),vLayer
            ],
            view: new View({
                projection: 'EPSG:4326',
                center: [104, 30],
                zoom: 10
            })
        });

        // 创建一个Feature，并设置好在地图上的位置
          var anchor = new Feature({
            geometry: new Point([104, 30])           
          });
           // 构建svg的Image对象
        var svg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve">'+    
      '<path fill="#156BB1" d="M22.906,10.438c0,4.367-6.281,14.312-7.906,17.031c-1.719-2.75-7.906-12.665-7.906-17.031S10.634,2.531,15,2.531S22.906,6.071,22.906,10.438z"/>'+
      '<circle fill="#FFFFFF" cx="15" cy="10.677" r="3.291"/></svg>';

          var mysvg = new Image();
          mysvg.src = 'data:image/svg+xml,' + escape(svg);


          // 设置样式，在样式中就可以设置图标
          anchor.setStyle(new Style({
            image: new Icon({
              img: mysvg,    // 设置Image对象
              imgSize: [30, 30]    // 及图标大小
            })
          }));
          // 添加到之前的创建的layer中去
          vLayer.getSource().addFeature(anchor);
        /*
          anchor: [0.5, 1] :
         默认情况下，位置坐标是按照比例的方式来设置的，范围从0到1，x轴上0表示最左边，1表示最右边，y轴上0表示最上边，1表示最下边。 如代码所示，x设置为0.5可以让图片在x方向上居中，y设置为1可以让图片在y方向上移动到最底端。 大家可以给予上面这个代码修改一下，试试[0, 0]会让图标处于什么位置？
        */

    },
    methods: {}
}
</script>

 