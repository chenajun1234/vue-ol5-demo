<template>
  <div id="mapDIV">
    <!--注意：需要设置tabindex，才能使div获得键盘事件-->
    <div id="map" class="map"></div>
  </div>
</template>
<script>
import "ol/ol.css";
import Map from "ol/Map.js";
import View from "ol/View.js";
import Feature from "ol/Feature.js";
import LineString from "ol/geom/LineString.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import Stamen from "ol/source/Stamen.js";
import VectorSource from "ol/source/Vector.js";
import { Stroke, Style } from "ol/style.js";
import { getVectorContext } from "ol/render.js";
import  arc from "arc/arc.js"; //cnpm install --save arc

//var arc = require("arc");

/**飞行动画效果 
 * 利用postrender(在地图渲染时都会触发) 事件,
 * 用window.setTimeout 延迟addFeature 不断触发postrender事件
*/
export default {
  data() {
    return {
      mapObj: null,
      flightsSource: null,
      tileLayer: null
    };
  },
  mounted() {
    window.vue = this;

    const tileLayer = new TileLayer({
      source: new Stamen({
        layer: "toner"
      })
    });

    const map = new Map({
      layers: [tileLayer],
      target: "map",
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });

    const style = new Style({
      stroke: new Stroke({
        color: "#EAE911",
        width: 2
      })
    });

    const flightsSource = new VectorSource({
      wrapX: false,
      attributions:
        "Flight data by " +
        '<a href="http://openflights.org/data.html">OpenFlights</a>,',
      loader: function() {
        const url = "src/static/data/openflights/flights.json";
        fetch(url)
          .then(function(response) {
            return response.json();
          })
          .then(function(json) {
            const flightsData = json.flights;
            for (let i = 0; i < flightsData.length; i++) {
              const flight = flightsData[i];
              const from = flight[0];
              const to = flight[1];

              // create an arc circle between the two locations
              const arcGenerator = new arc.GreatCircle(
                { x: from[1], y: from[0] },
                { x: to[1], y: to[0] }
              );

              const arcLine = arcGenerator.Arc(100, { offset: 10 });
              if (arcLine.geometries.length === 1) {
                const line = new LineString(arcLine.geometries[0].coords);
                line.transform("EPSG:4326", "EPSG:3857");

                const feature = new Feature({
                  geometry: line,
                  finished: false
                });
                // add the feature with a delay so that the animation
                // for all features does not start at the same time
                addLater(feature, i * 50);
              }
            }
            tileLayer.on("postrender", animateFlights);
          });
      }
    });

    const flightsLayer = new VectorLayer({
      source: flightsSource,
      style: function(feature) {
        // if the animation is still active for a feature, do not
        // render the feature with the layer style
        if (feature.get("finished")) {
          return style;
        } else {
          return null;
        }
      }
    });

    map.addLayer(flightsLayer);

    // const pointsPerMs = 0.1;
    function animateFlights(event) {
      const vectorContext = getVectorContext(event);
      const frameState = event.frameState;
      vectorContext.setStyle(style);

      const features = flightsSource.getFeatures();
      for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        if (!feature.get("finished")) {
          // only draw the lines for which the animation has not finished yet
          const coords = feature.getGeometry().getCoordinates();
          const elapsedTime = frameState.time - feature.get("start");
          const elapsedPoints = elapsedTime * 0.1;

          if (elapsedPoints >= coords.length) {
            feature.set("finished", true);
          }

          const maxIndex = Math.min(elapsedPoints, coords.length);
          const currentLine = new LineString(coords.slice(0, maxIndex));

          // directly draw the line with the vector context
          vectorContext.drawGeometry(currentLine);
        }
      }
      // tell OpenLayers to continue the animation
      map.render();
    }

    function addLater(feature, timeout) {
      window.setTimeout(function() {
        feature.set("start", new Date().getTime());
        flightsSource.addFeature(feature);
      }, timeout);
    }
  },
  methods: {}
};
</script>