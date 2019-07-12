<template>
    <div id="map" class="map"></div>
</template>
<script>
    import 'ol/ol.css';
    import GeoJSON from 'ol/format/GeoJSON';
    import Map from 'ol/Map';
    import VectorLayer from 'ol/layer/Vector';
    import VectorSource from 'ol/source/Vector';
    import View from 'ol/View';
  export default {
    name: 'geoJson',
    data(){
        return {
            countries:[],//geoJson对象  
            mapObj:null                  
        }
    },
    created(){
        this.$ajax.get("http://localhost:9999/src/static/data/countries.json")
            .then(res=>{
                //debugger;
               console.log(res.data)       
              this.countries=res.data;
            }).catch(err=>{
                console.log(err);
            });
    },
    mounted(){
     window.vue = this;
     this.mapObj= new Map({
        target: 'map',
        layers: [
          new VectorLayer({
            source: new VectorSource({
               /*features: (new ol.format.GeoJSON).readFeatures(this.countries, {     // 用readFeatures方法可以自定义坐标系
                    dataProjection: 'EPSG:4326',    // 设定JSON数据使用的坐标系
                    featureProjection: 'EPSG:3857' // 设定当前地图使用的feature的坐标系
                })*/
                format: new GeoJSON(),
                url: 'http://localhost:9999/src/static/data/countries.json'
            })
          })
        ],
        view: new View({
            center: [0, 0],
            zoom: 2
        })
      })
    }
  }
</script>