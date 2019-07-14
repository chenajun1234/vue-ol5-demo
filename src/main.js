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
Vue.prototype.$ajax=Axios;

//路由规则
let router = new VueRouter({	
	routes:[	
		{name:'Accessible',path:'/accessible',component:Accessible},
		{name:'Animation',path:'/animation',component:Animation},
		{name:'ArcgisImage',path:'/arcgis-image',component:ArcgisImage},
		{name:'ArcgisTiled',path:'/arcgis-tiled',component:ArcgisTiled},
		{name:'XYZ',path:'/xyz',component:XYZ},
		{name:'geoJson',path:'/geoJson',component:geoJson},
		{name:'VectorDemo',path:'/vectorDemo',component:VectorDemo}
		
	]
	
})


//创建vue实例
//构建示例
new Vue({
  el: '#app',
  router,
  render:c=>c(App)
})
