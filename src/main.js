'use strict';
//引入 vue
import Vue from 'vue'
//引入App.vue
import App from './app.vue';

import Accessible from './components/ol/Accessible.vue';
import Animation from './components/ol/Animation.vue';
import XYZ from './components/ol/XYZ.vue';
import ArcgisImage from './components/ol/ArcgisImage.vue';
import geoJson from './components/ol/LoadGeoJson.vue';
import ArcgisTiled from './components/ol/ArcgisTiled.vue';
import VectorDemo from './components/ol/VectorDemo.vue';
import DrawFeatures from './components/ol/DrawFeatures.vue';
import DrawFeatures2 from './components/ol/DrawFeatures2.vue';
import SnapDemo from './components/ol/SnapDemo.vue';

import WebGLDemo from './components/ol/WebGLDemo.vue';
import LayerSort from './components/ol/LayerSort.vue';
import LOD from './components/ol/LOD.vue';
import OverLayDemo from './components/ol/OverLayDemo.vue';
import OverLayAnimation from './components/ol/OverLayAnimation.vue';
import StyleVectorDemo from './components/ol/StyleVectorDemo.vue';
import StyleSVGVector from './components/ol/StyleSVGVector.vue';
import StyleGeometryVector from './components/ol/StyleGeometryVector.vue';
import StyleCanvasVector from './components/ol/StyleCanvasVector.vue';
import StyleTextVector from './components/ol/StyleTextVector.vue';
import EventDemo from './components/ol/EventDemo.vue';
import CustomerEvent from './components/ol/CustomerEvent.vue';
import SelectInteraction1 from './components/ol/SelectInteraction1.vue';
import SelectInteraction2 from './components/ol/SelectInteraction2.vue';
import SelectFilterStyle from './components/ol/SelectFilterStyle.vue';
import UnCheckSelected from './components/ol/UnCheckSelected.vue';
import ControlDemo from './components/ol/ControlDemo.vue';
import CustomerControl from './components/ol/CustomerControl.vue';
import SimpleAnimal from './components/ol/SimpleAnimal.vue';
import MoveFeatureAnimation from './components/ol/MoveFeatureAnimation.vue';
import FlightAnimation from './components/ol/FlightAnimation.vue';
import WFSDemo from './components/ol/WFSDemo.vue';
import WFSOption from './components/ol/WFSOption.vue';


//路由
import VueRouter from 'vue-router';
//安装插件
Vue.use(VueRouter);

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//自己公共样式
import './static/css/global.css';

//axios
import Axios from 'axios';
//默认请求配置
//Axios.default.baseURL="";

//挂载原型
Vue.prototype.$ajax = Axios;
import qs from 'qs'
Vue.prototype.qs = qs

//路由规则
let router = new VueRouter({
    routes: [
        { name: 'Accessible', CNName: 'Accessible', path: '/accessible', component: Accessible },   
        { name: 'ArcgisImage', CNName: 'ArcgisImage', path: '/arcgis-image', component: ArcgisImage },
        { name: 'ArcgisTiled', CNName: 'ArcgisTiled', path: '/arcgis-tiled', component: ArcgisTiled },
        { name: 'XYZ', CNName: '万能图', path: '/xyz', component: XYZ },
        { name: 'geoJson', CNName: '加载geoJson', path: '/geoJson', component: geoJson },
        { name: 'VectorDemo', CNName: '矢量地图', path: '/vectorDemo', component: VectorDemo },
        { name: 'DrawFeatures', CNName: '绘制地图', path: '/drawFeatures', component: DrawFeatures },
        { name: 'DrawFeatures2', CNName: '限制绘制地图', path: '/drawFeatures2', component: DrawFeatures2 },     
        { name: 'SnapDemo', CNName: '要素捕捉,端点自动连接', path: '/snapDemo', component: SnapDemo }, 

           
        { name: 'WebGLDemo', CNName: 'WebGLDemo', path: '/webGLDemo', component: WebGLDemo },
        { name: 'LayerSort', CNName: '图层叠加及管理', path: '/layerSort', component: LayerSort },
        { name: 'LOD', CNName: 'LOD与分辨率', path: '/LOD', component: LOD },
        { name: 'OverLayDemo', CNName: '应用overlay锚点', path: '/overLayDemo', component: OverLayDemo },
        { name: 'OverLayAnimation', CNName: '应用overlay动画', path: '/overLayAnimation', component: OverLayAnimation },
        { name: 'StyleVectorDemo', CNName: '应用style添加图标', path: '/styleVectorDemo', component: StyleVectorDemo },
        { name: 'StyleSVGVector', CNName: '应用style添加SVG图标', path: '/styleSVGVector', component: StyleSVGVector },
        { name: 'StyleGeometryVector', CNName: '应用style添加内置几何图标', path: '/styleGeometryVector', component: StyleGeometryVector },
        { name: 'StyleCanvasVector', CNName: '应用style添加Canvas图标', path: '/styleCanvasVector', component: StyleCanvasVector },
        { name: 'StyleTextVector', CNName: '应用style添加文字标注', path: '/styleTextVector', component: StyleTextVector },
        { name: 'EventDemo', CNName: '常用事件', path: '/eventDemo', component: EventDemo },
        { name: 'CustomerEvent', CNName: '自定义事件', path: '/customerEvent', component: CustomerEvent },
        { name: 'SelectInteraction1', CNName: '交互-选中1', path: '/selectInteraction1', component: SelectInteraction1 },
        { name: 'SelectInteraction2', CNName: '交互-选中2', path: '/selectInteraction2', component: SelectInteraction2 },
        { name: 'SelectFilterStyle', CNName: '交互-选中样式', path: '/selectFilterStyle', component: SelectFilterStyle },        
        { name: 'UnCheckSelected', CNName: '交互-选中-取消选中', path: '/unCheckSelected', component: UnCheckSelected },
        { name: 'ControlDemo', CNName: '控件demo', path: '/controlDemo', component: ControlDemo },
        { name: 'CustomerControl', CNName: '自定义控件', path: '/customerControl', component: CustomerControl } ,
        { name: 'SimpleAnimal', CNName: '简单动画效果', path: '/simpleAnimal', component: SimpleAnimal },
        { name: 'Animation', CNName: '移动地图', path: '/animation', component: Animation },
        { name: 'MoveFeatureAnimation', CNName: '移动动画效果', path: '/moveFeatureAnimation', component: MoveFeatureAnimation },
        { name: 'FlightAnimation', CNName: '飞行动画效果', path: '/flightAnimation', component: FlightAnimation },
        { name: 'WFSDemo', CNName: 'WFS Q for GeoServer', path: '/wfsDemo', component: WFSDemo },
        { name: 'WFSOption', CNName: 'WFS M for GeoServer', path: '/wfsOption', component: WFSOption }
        
    ]

})


//创建vue实例
//构建示例
new Vue({
    el: '#app',
    router,
    render: c => c(App)
})