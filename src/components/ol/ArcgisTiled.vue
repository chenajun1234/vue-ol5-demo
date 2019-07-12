<template>
    <div id="map">

    </div>
</template>

<script>
  import Map from 'ol/Map'
  import View from 'ol/View'
  import TileLayer from 'ol/layer/Tile'
  import OSM from 'ol/source/OSM'
  import TileArcGISRest from 'ol/source/TileArcGISRest'

  export default {
    name: 'ArcgisTiled',
    mounted ()
    {
      const url = 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/' +
        'Specialty/ESRI_StateCityHighway_USA/MapServer'
      const layers = [
        new TileLayer({
          source: new OSM()
        }),
        new TileLayer({
          extent: [-13884991, 2870341, -7455066, 6338219],
          source: new TileArcGISRest({
            url: url
          })
        })
      ]
      new Map({
        layers: layers,
        target: 'map',
        view: new View({
          center: [-10997148, 4569099],
          zoom: 4
        })
      })
    },
  }
</script>
