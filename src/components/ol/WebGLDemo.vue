<template>
   <div id='webGLContainer'>     
      <div id="map" class="map"></div>
      <div id="year"></div>
   </div>
</template>
<script>
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import { Map, View } from 'ol';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Vector as VectorSource, Stamen } from 'ol/source';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

import Renderer from 'ol/renderer/webgl/PointsLayer';//这个类需要ol6
import { clamp } from 'ol/math';
const color = [1, 0, 0, 0.5];
//我们将使用WebGL PointsLayer渲染器创建自定义图层。要创建自定义图层，
//我们需要覆盖createRenderer返回渲染器实例的函数。我们使用colorCallback和构造此渲染器sizeCallback来确定渲染点的颜色和大小。
class CustomLayer extends VectorLayer {
    createRenderer() {
        return new Renderer(this, {
            colorCallback: function(feature, vertex, component) {
                return color[component];
            },
            sizeCallback: function(feature) {
                return 18 * clamp(feature.get('mass') / 200000, 0, 1) + 8;
            },
            opacityCallback: function(feature) {
                // here the opacity channel of the vertices is used to store the year of impact
                return feature.get('year');
            },
            uniforms: {
                u_currentYear: function() {
                    return currentYear;
                }
            },
            //要将我们的点渲染为圆圈(本来是方块)，我们需要创建自定义片段着色器。我们将着色器作为fragmentShader渲染器构造函数的第二个参数的字符串属性传递给WebGL点图层渲染器。片段着色器是用OpenGL着色语言（GLSL）编写的。如果您有兴趣了解有关着色器和WebGL的更多信息，请查看着色器。
            //shader内容介绍:https://thebookofshaders.com/01/?lan=ch   http://openglbook.com/chapter-0-preface-what-is-opengl.html
            fragmentShader: `
                precision mediump float;
                uniform float u_currentYear;
                varying vec2 v_texCoord;
                varying vec4 v_color;
                varying float v_opacity;
                void main(void) {
                float impactYear = v_opacity;
                if (impactYear > u_currentYear) {
                    discard;
                }
                vec2 texCoord = v_texCoord * 2.0 - vec2(1.0, 1.0);
                float sqRadius = texCoord.x * texCoord.x + texCoord.y * texCoord.y;
                
                float factor = pow(1.1, u_currentYear - impactYear);
                float value = 2.0 * (1.0 - sqRadius * factor);
                float alpha = smoothstep(0.0, 1.0, value);
                gl_FragColor = v_color;
                gl_FragColor.a *= alpha;
              }`
        });
    }
}
const minYear = 1850;
const maxYear = 2015;
const span = maxYear - minYear;
const rate = 10; // years per second

const start = Date.now();
let currentYear = minYear;
export default {
    name: 'WebGLDemo',
    data() {
        return {
            countries: [], //geoJson对象  
            mapObj: null,
            mapSource: null           
        }
    },
    created() {
        this.mapSource = new VectorSource();



        this.$ajax.get("http://localhost:9999/src/static/data/meteorites.csv")
            .then(res => {
                const csv = res.data;
                const features = [];
                let prevIndex = csv.indexOf('\n') + 1; // scan past the header line
                let curIndex;
                while ((curIndex = csv.indexOf('\n', prevIndex)) != -1 && prevIndex <= 665336) {
                    const line = csv.substr(prevIndex, curIndex - prevIndex).split(',');
                    prevIndex = curIndex + 1;
                    const coords = fromLonLat([parseFloat(line[4]), parseFloat(line[3])]);
                    if (isNaN(coords[0]) || isNaN(coords[1])) {
                        // guard against bad data
                        continue;
                    }
                    features.push(new Feature({
                        mass: parseFloat(line[1]) || 0,
                        year: parseInt(line[2]) || 0,
                        geometry: new Point(coords)
                    }));
                }
                console.log('prevIndex==' + prevIndex);
                this.mapSource.addFeatures(features);
            }).catch(err => {
                console.log(err);
            });
    },
    mounted() {
        window.vue = this;
        this.mapObj = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new Stamen({ layer: 'toner' })
                }),
                new CustomLayer({
                    source: this.mapSource
                })
            ],
            view: new View({
                center: [31.8797296333, 106.2118975625],
                zoom: 3
            })
        });
      this.render();
    },
    methods:{
      render() {
        let yearElement = document.getElementById('year');
        let elapsed = rate * (Date.now() - start) / 1000;
        currentYear = minYear + (elapsed % span);
        yearElement.innerText = currentYear.toFixed(0);

        this.mapObj.render();
        requestAnimationFrame(this.render);
      }
    }
}
</script>
<style type="text/css" media="screen">
  #webGLContainer{
      position: relative;
  }
  #year {
    position: absolute;
    bottom: 1em;
    left: 1em;
    color: white;
    -webkit-text-stroke: 1px black;
    font-size: 2em;
    font-weight: bold;
  }
</style>