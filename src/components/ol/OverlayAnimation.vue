<template>
    <div id='mapDIV'>
        <div id="map" class="map"></div>
        <div id='divImg'><img id='anchorImg' src='src/static/img/圆1.png' /></div>
    </div>
</template>
<script>
import 'ol/ol.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Overlay from 'ol/Overlay.js';
import { Draw, Snap } from 'ol/interaction.js';
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
        this.mapObj = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                projection: 'EPSG:4326',
                center: [104, 30],
                zoom: 10
            })
        });


        // 下面把上面的图标附加到地图上，需要一个ol.Overlay
        let anchor = new Overlay({
            element: document.getElementById('divImg')
        });
        // 关键的一点，需要设置附加到地图上的位置
        anchor.setPosition([104, 30]);
        // 然后添加到map上
        this.mapObj.addOverlay(anchor);
        /*
            缺点
            当图标比较多的情况下，如果采用这种方式，那么我们会加入非常多的HTML元素，从而造成效率降低。 关于效率的测试. 为什么会这样呢？ 因为界面上元素的遍历在数量比较多的情况下，会变慢，基于此基础上的渲染，鼠标事件都会变慢。

            优点
            这种使用传统的方式显示图标可以应用传统的HTML技术，比如鼠标移动到图标上，鼠标图标变成手势。 我们可以用css来处理就可以了，比如在head里面添加下面的代码：
        */

    },
    methods: {}
}
</script>
<style type="text/css" media="screen">
    #divImg{
        width: 64px;height: 64px;
    }
/* 定义动画，图标先放大，再缩小 */  
  @keyframes zoom
  {
    from {top: 0; left: 0; width: 32px; height: 32px;}
    50% {top: -16px; left: -16px; width: 64px; height: 64px;}
    to {top: 0; left: 0; width: 32px; height: 32px;}
  }

  @-moz-keyframes zoom /* Firefox */
  {
    from {top: 0; left: 0; width: 32px; height: 32px;}
    50% {top: -16px; left: -16px; width: 64px; height: 64px;}
    to {top: 0; left: 0; width: 32px; height: 32px;}
  }

  @-webkit-keyframes zoom /* Safari 和 Chrome */
  {
    from {top: 0; left: 0; width: 32px; height: 32px;}
    50% {top: -16px; left: -16px; width: 64px; height: 64px;}
    to {top: 0; left: 0; width: 32px; height: 32px;}
  }

  @-o-keyframes zoom /* Opera */
  {
    from {top: 0; left: 0; width: 32px; height: 32px;}
    50% {top: -16px; left: -16px; width: 64px; height: 64px;}
    to {top: 0; left: 0; width: 32px; height: 32px;}
  }

  /* 应用css动画到图标元素上 */
  #anchorImg
  {
    display: block;
    position: absolute;
    animation: zoom 5s;
    animation-iteration-count: infinite; /* 一直重复动画 */
    -moz-animation: zoom 5s; /* Firefox */
    -moz-animation-iteration-count: infinite; /* 一直重复动画 */
    -webkit-animation: zoom 5s;  /* Safari 和 Chrome */
    -webkit-animation-iteration-count: infinite; /* 一直重复动画 */
    -o-animation: zoom 5s; /* Opera */
    -o-animation-iteration-count: infinite; /* 一直重复动画 */
  }    
</style>