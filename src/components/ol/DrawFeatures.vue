<template>
<div>
    <div id="map" class="map"></div>
    <div>
      <el-select v-model="value" placeholder="请选择" @change="typeChange">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>   
    </div>  
</div>
</template>

<script>
  import 'ol/ol.css';
  import Map from 'ol/Map.js';
  import View from 'ol/View.js'; 
  import {Draw,Snap} from 'ol/interaction.js';
  import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
  import {OSM, Vector as VectorSource} from 'ol/source.js';

  

    var vctSource = new VectorSource({wrapX: false});  
    var mapObj;
    var draw;
  export default {
    data(){
      return {
        options: [
                  { value: 'None', label: 'None' },
                  { value: 'Point',label: 'Point'},
                  { value: 'LineString',label: 'LineString'},
                  { value: 'Polygon',label: 'Polygon'},
                  { value: 'Circle',label: 'Circle'}
                  ],
        value:'None',
        selectVal: 'None'        
      }
    },
    name: 'drawFeatures',
    mounted(){
      window.vue = this; 
       let raster = new TileLayer({
          source: new OSM()
        });
       let vct = new VectorLayer({
          source: vctSource
        });
       this.mapObj = new Map({
        target: 'map',
        layers: [raster],       
        view: new View({
          center: [-11000000, 4600000],
          zoom: 4
        })        
      });
      this.mapObj.addLayer(vct);
      // window.vue.addInteractions();
      this.mapObj.addInteraction(new Snap({               
            source: vctSource
      })); 
    },
    methods:{
      addInteractions(){        
        if (this.selectVal !== 'None') {
          this.draw = new Draw({
            type: this.selectVal,//
            freehand: true,//写意图 相当于画笔一样 按住鼠标随便画 默认关闭
            source: vctSource           
          });
          this.mapObj.addInteraction(this.draw);
        }
      },
      typeChange(){
        let typeSelect = this;
        this.selectVal=typeSelect.value;
        if(this.draw){
          this.mapObj.removeInteraction(this.draw);
        }
        this.addInteractions();
      }
    }
  }
</script>