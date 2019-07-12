<template>
    <div>
        <div id="map"></div>
        <button @click="zoomOut">Zoom out</button>
        <button @click="zoomIn">Zoom in</button>
    </div>
</template>

<script>
  import Map from 'ol/Map.js'
  import View from 'ol/View.js'
  import {defaults as defaultControls} from 'ol/control.js'
  import TileLayer from 'ol/layer/Tile.js'
  import OSM from 'ol/source/OSM.js'
  export default {
    name: 'Accessible',
    data(){
      return {
        map: '',
      }
    },
    mounted(){
       this.map = new Map({
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ],
        target: 'map',
        controls: defaultControls({
          attributionOptions: {
            collapsible: false
          }
        }),
        view: new View({
          center: [0, 0],
          zoom: 2
        })
      });
    },
    methods: {
      zoomOut(){
        const view = this.map.getView()
        const zoom = view.getZoom()
        view.setZoom(zoom - 1)
      },
      zoomIn(){
        const view = this.map.getView()
        const zoom = view.getZoom()
        view.setZoom(zoom + 1)
      }
    }
  }
</script>
