<template>
<div>
<el-container style="height: auto; border: 1px solid #eee">
  <el-aside width="250px" style="background-color: rgb(238, 241, 246)">
    <el-menu :default-active="$route.path" :default-openeds="['1']"  router>
   <!-- <el-menu :default-openeds="['1']">-->
      <el-submenu index="1">
        <template slot="title">openLayers 地图</template> 
            <template  v-for="(item) in  $router.options.routes">                
                <el-menu-item :key="item.path" :index="item.path">
                   {{ item.CNName }}
                </el-menu-item>  
            </template>
      </el-submenu>      
    </el-menu>
  </el-aside>
  
  <el-container>
    <el-header style="text-align: left; font-size: 12px">
      <span id="titleText">示例地图</span>
     <!--  <el-dropdown>
         <i class="el-icon-setting" style="margin-right: 15px"></i>
         <el-dropdown-menu slot="dropdown">
           <el-dropdown-item>查看</el-dropdown-item>
           <el-dropdown-item>新增</el-dropdown-item>
           <el-dropdown-item>删除</el-dropdown-item>
         </el-dropdown-menu>
       </el-dropdown>     -->  
    </el-header>    
    <el-main>
       <router-view></router-view> 
    </el-main>
  </el-container>
</el-container>

</div>    
</template>
<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
  #map{         
        height: 700px;
    }
</style>

<script>
  export default {
   /* proxyTable:{
        '/geoserver':{
             // 测试环境
            target: 'http://localhost:8080',  // 接口域名
            changeOrigin: true,  //是否跨域
            pathRewrite: {
                '^/geoserver': '/'   //需要rewrite重写的,
            }              
        }
    }*/
  };
</script>