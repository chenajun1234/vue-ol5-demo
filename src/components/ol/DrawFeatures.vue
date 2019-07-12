<template>
    <div id="map" class="map">
    </div>
</template>

<script>
  import Map from 'ol/Map.js'
  import View from 'ol/View.js'
  import TileLayer from 'ol/layer/Tile.js'
  import XYZ from 'ol/source/XYZ.js'
  import {transform} from 'ol/proj.js'
  export default {
    name: 'XYZ',
    mounted(){
      new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new XYZ({
             // url: 'https://tilemap.1234.gov.cn/zhengxing/MAP/satemap/{z}/{x}/{y}.png'
             // url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              url:'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
              //url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
            })
          })
        ],
        view: new View({
            extent: [113.5, 21, 115, 23], //extent参数类型为[minX, minY, maxX, maxY]的ol.Extent
            // 设置深圳为地图中心
            center: [114.0595600000,22.5428600000],
            projection: 'EPSG:4326',
            zoom: 10//,
        })
      })
    }
  }
</script>