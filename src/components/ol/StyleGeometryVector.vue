<template>
    <div id='mapDIV'>
        <div id="map" class="map"></div>
    </div>
</template>
<script>
import 'ol/ol.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { Style, Icon, Fill, RegularShape, Stroke } from 'ol/style.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource, TileDebug } from 'ol/source.js';
import { transform } from 'ol/proj.js'

/*------------------规则几何图形*/
export default {
    data() {
        return {
            mapObj: null
        }
    },
    mounted() {
        window.vue = this;
        //需要一个vector的layer来放置图标
        var vLayer = new VectorLayer({
            source: new VectorSource()
        })
        this.mapObj = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                }), vLayer
            ],
            view: new View({
                projection: 'EPSG:4326',
                center: [104, 30],
                zoom: 10
            })
        });

        // 添加一个多边形
        var shape = new Feature({
            geometry: new Point([104, 30])
        });
        shape.name = '多边形';
        // 设置样式，在样式中就可以设置图标
        shape.setStyle(new Style({
            image: new RegularShape({
                points: 5, // 顶点数
                radius: 10, // 正多边形的半径 单位为像素
                stroke: new Stroke({ // 设置边的样式
                    color: 'red',
                    size: 2
                }),fill: new Fill({ // 设置五星填充样式
                    color: 'blue'
                })
            })

        }));
        // 添加到之前的创建的layer中去
        vLayer.getSource().addFeature(shape);

        // 添加一个五角星
        var star = new Feature({
            geometry: new Point([104.1, 30.1])
        });
        // 设置样式，在样式中就可以设置图标
        star.setStyle(new Style({
            image: new RegularShape({
                points: 5, // 顶点数
                radius1: 20, // Outer radius of a star. 外圈大小
                radius2: 10, // Inner radius of a star. 内圈大小
                stroke: new Stroke({ // 设置边的样式
                    color: 'red',
                    size: 2
                }),
                fill: new Fill({ // 设置五星填充样式
                    color: 'blue'
                })
            })
        }));
        star.name = '五角星';
        // 添加到之前的创建的layer中去
        vLayer.getSource().addFeature(star);

        // 监听地图点击事件
        this.mapObj.on('click', function(event) {
            var feature = window.vue.mapObj.forEachFeatureAtPixel(event.pixel, function(feature) {
                return feature;
            });
            if (feature) {
                // 将空心五星为红色实心五星
                var style = feature.getStyle().getImage();
                feature.setStyle(new Style({
                    image: new RegularShape({
                        points: style.getPoints(),
                        radius:  style.getRadius(),
                        radius1: style.radius_,
                        radius2: style.getRadius2(),
                        stroke: style.getStroke(),
                        fill: new Fill({
                            color: style.getFill().getColor()=='red'?'blue':'red'
                        })
                    })
                }));
            }
        });
    },
    methods: {}
}
</script>