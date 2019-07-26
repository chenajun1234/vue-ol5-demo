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
import WebGLDemo from './components/ol/WebGLDemo.vue';
import LayerSort from './components/ol/LayerSort.vue';
import LOD from './components/ol/LOD.vue';
import OverLayDemo from './components/ol/OverLayDemo.vue';
import OverLayAnimation from './components/ol/OverLayAnimation.vue';
import StyleVectorDemo from './components/ol/StyleVectorDemo.vue';





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

//路由规则
let router = new VueRouter({
    routes: [
        { name: 'Accessible', CNName: 'Accessible', path: '/accessible', component: Accessible },
        { name: 'Animation', CNName: '移动地图', path: '/animation', component: Animation },
        { name: 'ArcgisImage', CNName: 'ArcgisImage', path: '/arcgis-image', component: ArcgisImage },
        { name: 'ArcgisTiled', CNName: 'ArcgisTiled', path: '/arcgis-tiled', component: ArcgisTiled },
        { name: 'XYZ', CNName: '万能图', path: '/xyz', component: XYZ },
        { name: 'geoJson', CNName: '加载geoJson', path: '/geoJson', component: geoJson },
        { name: 'VectorDemo', CNName: '矢量地图', path: '/vectorDemo', component: VectorDemo },
        { name: 'DrawFeatures', CNName: '绘制地图', path: '/drawFeatures', component: DrawFeatures },
        { name: 'WebGLDemo', CNName: 'WebGLDemo', path: '/webGLDemo', component: WebGLDemo },
        { name: 'LayerSort', CNName: '图层叠加及管理', path: '/layerSort', component: LayerSort },
        { name: 'LOD', CNName: 'LOD与分辨率', path: '/LOD', component: LOD },
        { name: 'OverLayDemo', CNName: '应用overlay锚点', path: '/overLayDemo', component: OverLayDemo },
        { name: 'OverLayAnimation', CNName: '应用overlay动画', path: '/overLayAnimation', component: OverLayAnimation },
        { name: 'StyleVectorDemo', CNName: '应用style添加图标', path: '/styleVectorDemo', component: StyleVectorDemo }
        

    ]

})


//创建vue实例
//构建示例
new Vue({
    el: '#app',
    router,
    render: c => c(App)
})