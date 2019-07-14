<template>
  <!--拖拽geoJson 到地图渲染  -->
    <div> 
        <div id="map" class="map"></div>       
       
        <div id="tools">
          <el-button type="primary" @click="openModify">打开修改功能</el-button>         
          <el-button type="primary" @click="openDraw">打开绘制功能</el-button>
          <el-button id="clear">Clear</el-button>     
          <a id="download" type="primary" download="features.json">Download</a>
        </div>

     </div>
</template>
<script>
    import 'ol/ol.css';
    import GeoJSON from 'ol/format/GeoJSON';
    import Map from 'ol/Map';
    import VectorLayer from 'ol/layer/Vector';
    import VectorSource from 'ol/source/Vector';
    import View from 'ol/View';

    import {Draw, Modify, DragAndDrop,Snap} from 'ol/interaction.js';
    import GeometryType from 'ol/geom/GeometryType';
    import {Style, Fill, Stroke} from 'ol/style';
    import {getArea} from 'ol/sphere';
    import colormap from 'colormap';

    const source = new VectorSource();
    const min = 1e8; // the smallest area
    const max = 2e13; // the biggest area
    const steps = 50;
    const ramp = colormap({
      colormap: 'blackbody',
      nshades: steps
    });

  export default {
    name: 'DragAndDrop',
    data(){
        return {
            countries:[],//geoJson对象  
            mapObj:null  ,
            colorsM:null                
        }
    },
    mounted(){
     window.vue = this;    
     this.mapObj= new Map({
        target: 'map',
        layers: [
        ],
        view: new View({
            center: [0, 0],
            zoom: 2
        })
      })    

      //增加拖拽geojson功能
      let layer = new VectorLayer({
          source: source,
          /*同一种颜色
          style: new Style({
            fill: new Fill({
              color: 'red'
            }),
            stroke: new Stroke({
              color: 'white'
            })
          })*/
          /*style: function(feature, resolution) {
                const name = feature.get('name').toUpperCase();
                return name < "N" ? 'red' : 'blue'; // assuming these are created elsewhere
            }*/
           style: function(feature) {
                return new Style({
                  fill: new Fill({
                    color: window.vue.getColors(feature)
                  }),
                  stroke: new Stroke({
                    color: 'rgba(255,255,255,0.8)'
                  })
                });
              }
        });
      this.mapObj.addLayer(layer);
      //拖拽功能
      this.mapObj.addInteraction(new DragAndDrop({
          source: source,
          formatConstructors: [GeoJSON]
        }));

     //与其他编辑交互一样，我们将配置快照交互以使用我们的矢量源并将其添加到地图：
        this.mapObj.addInteraction(new Snap({               
            source: source
        })); 
        //清除数据功能
        const clear = document.getElementById('clear');
        clear.addEventListener('click', function() {
              source.clear();
        });
        //下载功能
        const format = new GeoJSON({featureProjection: 'EPSG:3857'});
        const download = document.getElementById('download');
        source.on('change', function() {
          const features = source.getFeatures();
          const json = format.writeFeatures(features);
          download.href = 'data:text/json;charset=utf-8,' + json;
        });


    },
    methods:{
        openModify(){
            //修改功能 拖动顶点来修改要素。您也可以删除顶点Alt+Click
            this.mapObj.addInteraction(new Modify({
              source: source
            })); 
        },
        openDraw(){
            //创建一个绘制交互，配置为绘制多边形并将它们添加到我们的矢量源：
            this.mapObj.addInteraction(new Draw({
                type: GeometryType.POLYGON,//'Polygon',
                source: source
            })); 
        },
        clearMapData(){
          this.source.clear();
        },        
        clamp(value, low, high) {
          return Math.max(low, Math.min(value, high));
        },
        getColors(feature) {
          const area = getArea(feature.getGeometry());
          const f = Math.pow(this.clamp((area - min) / (max - min), 0, 1), 1 / 2);
          const index = Math.round(f * (steps - 1));
          return ramp[index];
        }
    }  
  }
</script>
<style type="text/css" media="screen">
    #tools {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }
    #tools a {
      display: inline-block;
      padding: 0.5rem;
      background: white;
      cursor: pointer;
    }
</style>