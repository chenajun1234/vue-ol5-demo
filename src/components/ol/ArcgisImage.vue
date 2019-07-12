<template>
    <div id="map">
        
    </div>
</template>

<script>
  import Map from 'ol/Map.js'
  import View from 'ol/View.js'
  import TileLayer from 'ol/layer/Tile.js'
  import ImageLayer from 'ol/layer/Image.js'
  import OSM from 'ol/source/OSM.js'
  import ImageArcGISRest from 'ol/source/ImageArcGISRest.js'
  export default {
    name: 'ArcgisImage',
    mounted() {
      const url = 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/' +
        'Specialty/ESRI_StateCityHighway_USA/MapServer'
      const layers = [
        new TileLayer({
          source: new OSM()
        }),
        new ImageLayer({
          source: new ImageArcGISRest({
            ratio: 1,
            params: {},
            url: url
          })
        })
      ]
      new Map({
        layers: layers,
        target: 'map',
        view: new View({
          center: [-10997148,4569099],
          zoom: 4
        })
      })
    }
  }
</script>
