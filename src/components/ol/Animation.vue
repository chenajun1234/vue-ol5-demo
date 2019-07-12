<template>
    <div>
        <div id="map"></div>
        <button title="Rotate clockwise" @click="rotateClockwise">↻</button>
        <button title="Rotate counterclockwise" @click="rotateCounterClockwise">↺</button>
        <button @click="toLondon">Pan to London</button>
        <button @click="toMoscow">Elastic ot Moscow</button>
        <button @click="toIstanbul">Bounce to Istanbul</button>
        <button @click="toRome">Spin to Rome</button>
        <button @click="toBern">Fly ot Bern</button>
        <button @click="aroundRome">Rotate around Rome</button>
        <button @click="tour">Take a tour</button>
    </div>
</template>

<script>
  import Map from 'ol/Map.js';
  import View from 'ol/View.js';
  import {easeIn, easeOut} from 'ol/easing';
  import TileLayer from 'ol/layer/Tile.js';
  import {fromLonLat} from 'ol/proj.js';
  import OSM from 'ol/source/OSM.js';

  export default {
    name: 'Animation',
    mounted()
    {
      this.view = new View({
        center: this.istanbul,
        zoom: 6,
      });
      new Map({
        target: 'map',
        layers: [
          new TileLayer({
            preload: 4,
            source: new OSM(),
          }),
        ],
        loadTilesWhileAnimating: true,
        view: this.view,
      });
    },
    data()
    {
      return {
        london: fromLonLat([-0.12755, 51.507222]),
        moscow: fromLonLat([37.6178, 55.7517]),
        istanbul: fromLonLat([28.9744, 41.0128]),
        rome: fromLonLat([12.5, 41.9]),
        bern: fromLonLat([7.4458, 46.95]),
        view: {},
      };
    },
    methods: {
      bounce(t)
      {
        const s = 7.5625;
        const p = 2.75;
        let l;
        if (t < (1 / p))
        {
          l = s * t * t;
        }
        else
        {
          if (t < (2 / p))
          {
            t -= (1.5 / p);
            l = s * t * t + 0.75;
          }
          else
          {
            if (t < (2.5 / p))
            {
              t -= (2.25 / p);
              l = s * t * t + 0.9375;
            }
            else
            {
              t -= (2.625 / p);
              l = s * t * t + 0.984375;
            }
          }
        }
        return l;
      },
      elastic(t)
      {
        return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
      },
      rotateClockwise()
      {
        this.view.animate({
          rotation: this.view.getRotation() + Math.PI / 2,
        });
      },
      rotateCounterClockwise()
      {
        this.view.animate({
          rotation: this.view.getRotation() - Math.PI / 2,
        });
      },
      toLondon(){
        this.view.animate({
          center: this.london,
          duration: 2000,
        });
      },
      toMoscow()
      {
        this.view.animate({
          center: this.moscow,
          duration: 2000,
          easing: this.elastic,
        });
      },
      toIstanbul()
      {
        this.view.animate({
          center: this.istanbul,
          duration: 2000,
          easing: this.bounce,
        });
      },
      toRome()
      {
        const center = this.view.getCenter();
        this.view.animate({
          center: [
            center[0] + (this.rome[0] - center[0]) / 2,
            center[1] + (this.rome[1] - center[1]) / 2,
          ],
          rotation: Math.PI,
          easing: easeIn,
        }, {
          center: this.rome,
          rotation: 2 * Math.PI,
          easing: easeOut,
        });
      },
      flyTo(location, done)
      {
        const duration = 2000;
        const zoom = this.view.getZoom();
        let parts = 2;
        let called = false;

        function callback(complete)
        {
          --parts;
          if (called)
          {
            return;
          }
          if (parts === 0 || !complete)
          {
            called = true;
            done(complete);
          }
        }

        this.view.animate({
          center: location,
          duration: duration,
        }, callback);
        this.view.animate({
          zoom: zoom - 1,
          duration: duration / 2,
        }, {
          zoom: zoom,
          duration: duration / 2,
        }, callback);
      },
      toBern()
      {
        this.flyTo(this.bern, function() {});
      },
      aroundRome()
      {
        const rotation = this.view.getRotation();
        this.view.animate({
          rotation: rotation + Math.PI,
          anchor: this.rome,
          easing: easeIn,
        }, {
          rotation: rotation + 2 * Math.PI,
          anchor: this.rome,
          easing: easeOut,
        });
      },
      tour()
      {
        const locations = [this.london, this.bern, this.rome, this.moscow, this.istanbul];
        let index = -1
        let self = this

        function next(more)
        {
          if (more)
          {
            ++index
            if(index < locations.length)
            {
              const  delay = index === 0?0: 750
              setTimeout(()=>{
                self.flyTo(locations[index],next)
              },delay)
            } else {
              alert('Tour complete')
            }
          } else {
            alert('Tour cancelled')
          }
        }
        next(true)
      },
    },
  };
</script>
