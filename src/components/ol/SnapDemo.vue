<template>
    <div>
        <div id="map" class="map"></div>
        <div>
            <el-select v-model="value" placeholder="请选择" @change="typeChange">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
    </div>
</template>
<script>
import 'ol/ol.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { Draw, Snap } from 'ol/interaction.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Circle as CircleStyle, Fill, Stroke, Style,Icon } from 'ol/style.js';
import Select from 'ol/interaction/Select.js';
import { pointerMove } from 'ol/events/condition.js';




var draw;
export default {
    data() {
        return {
            mapObj: null,
            options: [
                { value: 'None', label: 'None' },
                { value: 'Point', label: 'Point' },
                { value: 'LineString', label: 'LineString' },
                { value: 'Polygon', label: 'Polygon' },
                { value: 'Circle', label: 'Circle' }
            ],
            value: 'None',
            selectVal: 'None',
            ExampleDraw: {}
        }
    },
    name: 'drawFeatures',
    mounted() {
        window.vue = this;
        let raster = new TileLayer({
            source: new OSM()
        });
        let pointLayer = new VectorLayer({
            source: new VectorSource()            
        });
         let lineLayer = new VectorLayer({
            source: new VectorSource(),
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new Stroke({
                    color: '#ffcc33',
                    width: 2
                })                
            })
        });

          let circleLayer = new VectorLayer({
            source: new VectorSource(),
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });

           let polygonLayer = new VectorLayer({
            source: new VectorSource(),
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new Stroke({
                    color: '#ffcc33',
                    width: 2
                })
            })
        });
        let pointStyle= new Style({
                    image: new Icon({
                      src: '/src/static/img/圆2.png'
                    })
                });
       
        pointLayer.setStyle(pointStyle);
        this.mapObj = new Map({
            target: 'map',
            layers: [raster, pointLayer,lineLayer,circleLayer,polygonLayer],
            view: new View({
                center: [-11000000, 4600000],
                zoom: 4
            })
        });

        this.ExampleDraw = {
            init: function() {
                window.vue.mapObj.addInteraction(this.Point);
                this.Point.setActive(false);
                window.vue.mapObj.addInteraction(this.LineString);
                this.LineString.setActive(false);
                window.vue.mapObj.addInteraction(this.Polygon);
                this.Polygon.setActive(false);
                window.vue.mapObj.addInteraction(this.Circle);
                this.Circle.setActive(false);
            },
            Point: new Draw({
                source: pointLayer.getSource(),
                type: 'Point',
                style:pointStyle
            }),
            LineString: new Draw({
                source: lineLayer.getSource(),
                type: 'LineString'
            }),
            Polygon: new Draw({
                source: polygonLayer.getSource(),
                type: 'Polygon'
            }),
            Circle: new Draw({
                source: circleLayer.getSource(),
                type: 'Circle'
            }),
            getActive: function() {
                return this.activeType ? this[this.activeType].getActive() : false;
            },
            setActive: function(active) {
                var type = window.vue.selectVal;
                if(type=='None'){
                    this.activeType && this[this.activeType].setActive(false);
                    this.activeType = null;
                    return;
                }
                if (active) {
                    this.activeType && this[this.activeType].setActive(false);
                    this[type].setActive(true);
                    this.activeType = type;
                } else {
                    this.activeType && this[this.activeType].setActive(false);
                    this.activeType = null;
                }
            }
        };

        this.ExampleDraw.init();

        this.ExampleDraw.setActive(true);
        var snapPointLayer = new Snap({
            source: pointLayer.getSource()
        });
         var snapLineLayer = new Snap({
            source: lineLayer.getSource()
        });
        this.mapObj.addInteraction(snapPointLayer);
        this.mapObj.addInteraction(snapLineLayer);
         this.mapObj.on('contextmenu', function(event) {
            event.preventDefault();
            //右键取消绘制
             window.vue.ExampleDraw.setActive(false);
               window.vue.value= 'None';
             window.vue.selectVal= 'None';
       })
           let selectPointStyle= new Style({
                    image: new Icon({
                      src: '/src/static/img/圆2_选中.png'
                    })
                })
        var selectSingleClick = new Select({
            condition: pointerMove, // 唯一的不同之处，设置鼠标移到feature上就选取 
            style: selectPointStyle,
            // 关键： 设置过了条件，可以用feature来写过滤，也可以用layer来写过滤
            filter: function(feature, layer) {
                return layer === pointLayer;
            }
        });
        this.mapObj.addInteraction(selectSingleClick);
       
    },
    methods: {
        typeChange(value) {
            //this.ExampleDraw.getActive() &&
           let typeSelect = this;
            this.selectVal=typeSelect.value;
            this.ExampleDraw.setActive(true);
        }
    }
}
</script>