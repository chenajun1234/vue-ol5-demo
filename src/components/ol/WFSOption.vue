<template>
  <div id="mapDIV">
    <div id="map" class="map"></div>
    <div>
      <input type="button" value="查询" @click="queryWfs" />
      <input id="select" type="checkbox" value="select" />选择
      <input id="modify" type="checkbox" value="modify" />编辑
      <input id="add" type="checkbox" value="add" />新增线条
      <input id="save" type="button" value="保存修改" @click="onSave" />
      <input id="save" type="button" value="插入绘制数据" @click="onInsert" />
      <input id="delete" type="button" value="删除选中Feature" @click="onDeleteFeature" />
    </div>
  </div>
</template>
<script>
import "ol/ol.css";
import Map from "ol/Map.js";
import View from "ol/View.js";
import Feature from "ol/Feature.js";
import { GeoJSON, WFS } from "ol/format.js";
import { Style, Stroke } from "ol/style.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { OSM, Vector as VectorSource, TileDebug } from "ol/source.js";
import { Select, Modify, Draw } from "ol/interaction.js";
import MultiLineString from "ol/geom/MultiLineString.js";
import X2JS from "x2js";

/*WFS options*/
export default {
  data() {
    return {
      mapObj: null,
      wfsVectorLayer: null,
      drawVectorLaye: null,
      modifiedFeatures: null,
      drawedFeature: null,
      selectInteraction: null,
      modifyInteraction: null,
      drawInteraction: null,
      newId:1
    };
  },
  mounted() {
    window.vue = this;
    // 选择器
    this.selectInteraction = new Select({
      style: new Style({
        stroke: new Stroke({
          color: "red",
          width: 2
        })
      })
    });
    // 修改器
    this.modifyInteraction = new Modify({
      style: new Style({
        stroke: new Stroke({
          color: "red",
          width: 5
        })
      }),
      features: this.selectInteraction.getFeatures()
    });
    this.drawVectorLaye = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          color: "yellow",//画完之后显示的颜色
          width: 5
        })
      })
    });
    //添加绘制新图形的interaction，用于添加新的线条
    this.drawInteraction = new Draw({
      type: "LineString", // 设定为线条
      style: new Style({
        stroke: new Stroke({
          color: "red",//画的时候什么颜色
          width: 10
        })
      }),
      source: this.drawVectorLaye.getSource()
    });
    this.mapObj = new Map({
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      target: "map",
      view: new View({
        center: [-73.99710639567148, 40.742270050255556],
        maxZoom: 19,
        zoom: 14,
        projection: "EPSG:4326"
      })
    });
    this.wfsVectorLayer = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON({
          geometryName: "the_geom" // 因为数据源里面字段the_geom存储的是geometry，所以需要指定
        }),
        url:
          "http://localhost:8080/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&typeNames=nyc_roads:nyc_roads&outputFormat=application/json&srsname=EPSG:4326"
      }),
      style: new Style({
        stroke: new Stroke({
          color: "blue",
          width: 5
        })
      })
    });
    this.initEvent();
  },
  methods: {
    initEvent() {
      this.modifyInteraction.on("modifyend", function(e) {
        // 把修改完成的feature暂存起来
        window.vue.modifiedFeatures = e.features;
      });
      this.drawInteraction.on("drawend", function(e) {
        // 绘制结束时暂存绘制的feature
        window.vue.drawedFeature = e.feature;
      });
      this.mapObj.addLayer(this.wfsVectorLayer);
      this.mapObj.addLayer(this.drawVectorLaye);
      let selectE = document.getElementById("select");
      selectE.addEventListener("change", this.selectCahnge);
      let modifyE = document.getElementById("modify");
      modifyE.addEventListener("change", this.modifyCahnge);
      let addE = document.getElementById("add");
      addE.addEventListener("change", this.addCahnge);
    },
    queryWfs() {
      // 通过wfs查询所有的要素
      // 支持重新查询
      if (this.wfsVectorLayer) {
        this.mapObj.removeLayer(this.wfsVectorLayer);
      }
      // 创建新的图层来加载wfs的要素
      this.wfsVectorLayer = new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON({
            geometryName: "the_geom" // 因为数据源里面字段the_geom存储的是geometry，所以需要指定
          }),
          url:
            "http://localhost:8080/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&typeNames=nyc_roads:nyc_roads&outputFormat=application/json&srsname=EPSG:4326"
        }),
        style: function(feature, resolution) {
          return new Style({
            stroke: new Stroke({
              color: "blue",
              width: 5
            })
          });
        }
      });
      this.mapObj.addLayer(this.wfsVectorLayer);
    },
    selectCahnge(event) {
      if (event.srcElement.checked) {
        // 勾选选择复选框时，添加选择器到地图
        this.mapObj.removeInteraction(this.selectInteraction);
        this.mapObj.addInteraction(this.selectInteraction);
      } else {
        // 不勾选选择复选框的情况下，移出选择器和修改器
        this.mapObj.removeInteraction(this.selectInteraction);
        document.getElementById("modify").checked = false;
        this.mapObj.removeInteraction(this.modifyInteraction);
        this.modifiedFeatures = null;
      }
    },
    modifyCahnge(event) {
      if (event.srcElement.checked) {
        // 勾选修改复选框时，添加选择器和修改器到地图
        document.getElementById("select").checked = true;
        this.mapObj.removeInteraction(this.modifyInteraction);
        this.mapObj.addInteraction(this.modifyInteraction);
        this.mapObj.removeInteraction(this.selectInteraction);
        this.mapObj.addInteraction(this.selectInteraction);
      } else {
        // 不勾选修改复选框时，移出修改器
        this.mapObj.removeInteraction(this.modifyInteraction);
        this.modifiedFeatures = null;
      }
    },
    addCahnge(event) {
      if (event.srcElement.checked) {
        document.getElementById("select").checked = false;
        document.getElementById("modify").checked = false;
        this.mapObj.removeInteraction(this.modifyInteraction);
        this.mapObj.removeInteraction(this.selectInteraction);
        // 勾选新增复选框时，添加绘制的Interaction
        this.mapObj.removeInteraction(this.drawInteraction);
        this.mapObj.addInteraction(this.drawInteraction);
      } else {
        // 取消勾选新增复选框时，移出绘制的Interaction，删除已经绘制的feature
        this.mapObj.removeInteraction(this.drawInteraction);
        if (this.drawedFeature) {
          this.drawVectorLaye.getSource().removeFeature(this.drawedFeature);
        }
        this.drawedFeature = null;
      }
    },
    onInsert() {
      // 转换坐标
      var geometry = this.drawedFeature.getGeometry().clone();
      geometry.applyTransform(
            function(flatCoordinates,flatCoordinates2,stride){
                for (var j = 0; j < flatCoordinates.length; j += stride) {
                    var y = flatCoordinates[j];
                    var x = flatCoordinates[j + 1];
                    flatCoordinates[j] = x;
                    flatCoordinates[j + 1] = y;
                }
            }
      );

      // 设置feature对应的属性，这些属性是根据数据源的字段来设置的
      var newFeature = new Feature();
      newFeature.setId("nyc_roads.new." + this.newId);
      newFeature.setGeometryName("the_geom");
      newFeature.set("the_geom", null);
      newFeature.set("name", newFeature.getId());
      newFeature.set("modified", newFeature.getId());
      newFeature.set("vsam", 0);
      newFeature.set("sourcedate", "");
      newFeature.set("sourcetype", "");
      newFeature.set("source_id", this.newId);
      newFeature.set("borough", "");
      newFeature.set("feat_code", 0);
      newFeature.set("feat_desc", "11");
      newFeature.set("feat_type", 0);
      newFeature.set("exported", "true");
      newFeature.setGeometry(
        new MultiLineString([geometry.getCoordinates()])
      );

      this.addWfs([newFeature]);
      // 更新id
      this.newId = this.newId + 1;
      // 3秒后，自动刷新页面上的feature
      setTimeout(function() {
        window.vue.drawVectorLaye.getSource().clear();
        window.vue.queryWfs();
      }, 3000);
    },
    onSave() {
      // 保存已经编辑的要素
      if (this.modifiedFeatures && this.modifiedFeatures.getLength() > 0) {
        // 转换坐标
        var modifiedFeature = this.modifiedFeatures.item(0).clone();
        // 注意ID是必须，通过ID才能找到对应修改的feature
        modifiedFeature.setId(this.modifiedFeatures.item(0).getId());
        // 调换经纬度坐标，以符合wfs协议中经纬度的位置
        modifiedFeature
          .getGeometry()
          .applyTransform(function(flatCoordinates, flatCoordinates2, stride) {
            for (var j = 0; j < flatCoordinates.length; j += stride) {
              var y = flatCoordinates[j];
              var x = flatCoordinates[j + 1];
              flatCoordinates[j] = x;
              flatCoordinates[j + 1] = y;
            }
          });
        this.modifyWfs([modifiedFeature]);
      }
    },
    onDeleteFeature() {
      // 删选择器选中的feature
      if (this.selectInteraction.getFeatures().getLength() > 0) {
        this.deleteWfs([this.selectInteraction.getFeatures().item(0)]);        
      }
    },
    modifyWfs(features) {
      // 把修改提交到服务器端
      var WFSTSerializer = new WFS();
      //writeTransaction(inserts, updates, deletes, options)
      var featObject = WFSTSerializer.writeTransaction(null, features, null, {
        featureType: "nyc_roads",
        featureNS: "http://geoserver.org/nyc_roads", // 注意这个值必须为创建工作区时的命名空间URI
        srsName: "EPSG:4326"
      });
      // 转换为xml内容发送到服务器端
      var serializer = new XMLSerializer();
      var featString = serializer.serializeToString(featObject);
      var params = { service: "wfs" };
      this.$ajax
        .post("http://localhost:8080/geoserver/wfs", featString, {
          headers: {
            "Content-Type": "text/xml"
          }
        })
        .then(res => {
          console.log(res.data);
          var x2js = new X2JS();
          var jsonObj = x2js.xml2js(res.data);
          console.log(jsonObj);
          //this.countries=res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    addWfs(features) {
      // 把新增数据提交到服务器端
      var WFSTSerializer = new WFS();
      var featObject = WFSTSerializer.writeTransaction(features, null, null, {
        featureType: "nyc_roads",
        featureNS: "http://geoserver.org/nyc_roads", // 注意这个值必须为创建工作区时的命名空间URI
        srsName: "EPSG:4326"
      });
      // 转换为xml 内容发送到服务器端
      var serializer = new XMLSerializer();
      var featString = serializer.serializeToString(featObject);
      var params = { service: "wfs" };
      this.$ajax
        .post("http://localhost:8080/geoserver/wfs", featString, {
          headers: {
            "Content-Type": "text/xml"
          }
        })
        .then(res => {
          console.log(res.data);
          var x2js = new X2JS();
          var jsonObj = x2js.xml2js(res.data);
          console.log(jsonObj);
          //this.countries=res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteWfs(features){
     // 在服务器端删除feature
      var WFSTSerializer = new WFS();
      var featObject = WFSTSerializer.writeTransaction( null, null,features, {
        featureType: "nyc_roads",
        featureNS: "http://geoserver.org/nyc_roads", // 注意这个值必须为创建工作区时的命名空间URI
        srsName: "EPSG:4326"
      });
      // 转换为xml 内容发送到服务器端
      var serializer = new XMLSerializer();
      var featString = serializer.serializeToString(featObject);
      this.$ajax
        .post("http://localhost:8080/geoserver/wfs", featString, {
          headers: {
            "Content-Type": "text/xml"
          }
        })
        .then(res => {
          console.log(res.data);
          var x2js = new X2JS();
          var jsonObj = x2js.xml2js(res.data);
          console.log(jsonObj);
          window.vue.selectInteraction.getFeatures().clear();
          window.vue.queryWfs();
          //this.countries=res.data;
        })
        .catch(err => {
          window.vue.selectInteraction.getFeatures().clear();
          console.log(err);
        });
    }
  }
};
</script>