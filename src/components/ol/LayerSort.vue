<template>
    <div>
        <div id="map" class="map"></div>
        <div>
            <span>显示/隐藏：</span>
            <el-checkbox-group v-model="checkedFeatureNames">
                <template v-for="featureName in featureNames">
                    <el-checkbox @change="checked=>toggleFeature(featureName,checked)" :label="featureName" :key="featureName">
                        {{featureName}}</el-checkbox>
                </template>
            </el-checkbox-group>
        </div>
        <div>
            <span>显示/隐藏：</span>
            <el-radio v-model="radio" label="1" @change="sortleLayer">底图最上</el-radio>
            <el-radio v-model="radio" label="2" @change="sortleLayer">圆最上</el-radio>
            <el-radio v-model="radio" label="3" @change="sortleLayer">点最上</el-radio>
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
import Feature from 'ol/Feature';
import { Style, Circle, Fill, Stroke } from 'ol/style.js';
import Point from 'ol/geom/Point';

// 创建3个图层
var osmLayer = new TileLayer({
    source: new OSM()
});

var pointLayer = new VectorLayer({
    source: new VectorSource()
});
var circleLayer = new VectorLayer({
    source: new VectorSource()
});
export default {
    name: 'LayerSort',
    data() {
        return {
            checkedFeatureNames: ['底图', '圆', '点'], //复选框默认选中 '底图','圆','点'
            featureNames: ['底图', '圆', '点'],
            radio: 3
        };
    },
    mounted() {

        new Map({
            target: 'map',
            layers: [osmLayer, pointLayer, circleLayer],
            view: new View({
                center: [0, 0],
                zoom: 2
            })
        })

        // 添加点
        var point = new Feature({
            geometry: new Point([0, 0])
        });
        point.setStyle(new Style({
            image: new Circle({
                radius: 1,
                fill: new Fill({
                    color: 'red'
                }),
                stroke: new Stroke({
                    color: 'red',
                    size: 1
                })
            })
        }));
        pointLayer.getSource().addFeature(point);


        // 添加圆
        var circle = new Feature({
            geometry: new Point([0, 0])
        });
        circle.setStyle(new Style({
            image: new Circle({
                radius: 10,
                stroke: new Stroke({
                    color: 'blue',
                    size: 1
                })
            })
        }));
        circleLayer.getSource().addFeature(circle);
    },
    methods: {
        toggleFeature(e, elem) {
            switch (e) {
                case '底图':
                    // 隐藏显示osm图层
                    osmLayer.setVisible(elem);
                    break;
                case '圆':
                    // 隐藏显示circle图层
                    circleLayer.setVisible(elem);
                    break;
                default:
                    // 隐藏显示point图层
                    pointLayer.setVisible(elem);
            }

        },
        sortleLayer(elem) {
          console.log(osmLayer.getZIndex()+'--'+circleLayer.getZIndex()+'--'+pointLayer.getZIndex());
            switch (elem) {
                case '1':
                    // 置顶osm图层到最上面
                    this.upOsm();
                    break;
                case '2':
                    // 置顶circle图层到最上面
                    this.upCircle();
                    break;
                default:
                    // 置顶point图层到最上面
                    this.upPoint();
            }
        },
        upOsm() {
            //置顶osm图层到最上面
            osmLayer.setZIndex(3);           
            circleLayer.setZIndex(circleLayer.getZIndex() - 1);
            pointLayer.setZIndex(pointLayer.getZIndex() - 1);
        },
        upCircle() {
            // 置顶circle图层到最上面
            circleLayer.setZIndex(3);
            osmLayer.setZIndex(osmLayer.getZIndex() - 1);
            pointLayer.setZIndex(pointLayer.getZIndex() - 1);

        },
        upPoint() {
            // 置顶point图层到最上面
            pointLayer.setZIndex(3);
            osmLayer.setZIndex(osmLayer.getZIndex() - 1);
            circleLayer.setZIndex(circleLayer.getZIndex() - 1);

        }
    }
}
</script>