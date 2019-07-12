<template>
	<div id="apps">  		
       <div id="nav">
          <router-link to="/">Accessible</router-link> |
          <router-link to="/animation">Animation</router-link> |
          <router-link to="/arcgis-image">ArcgisImage</router-link> |
          <router-link to="/arcgis-tiled">ArcgisTiled</router-link> |
          <router-link to="/xyz">万能简单地图XYZ</router-link> |
          <router-link to="/geoJson">加载geoJson</router-link> |
          <router-link to="/vectorDemo">矢量图和简单方法示例</router-link>           
      </div>
      <router-view></router-view>       
    </div>
</template>

<script>
export default { 
  data () {
    return {     
    }
  }
}
</script>

<style lang="less">
    @import "~ol/ol.css";

    #apps {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        background-color: beige;
        padding: 20px;
        position: absolute;        
        left:30%;
        z-index:99999;
        a {
            font-weight: bold;
            color: #2c3e50;
            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
    #map{
         
          height: auto;
    }
</style>
