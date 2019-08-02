<template>
    <div id='mapDIV'>
        <!--注意：需要设置tabindex，才能使div获得键盘事件-->
        <div id="map" class="map"></div>
        <label for="speed">
            speed:&nbsp;
            <input id="speed" type="range" min="10" max="999" step="10" value="60">
        </label>
        <button id="start-animation">Start Animation</button>
    </div>
</template>
<script>
import 'ol/ol.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import Polyline from 'ol/format/Polyline.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import BingMaps from 'ol/source/BingMaps.js';

import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from 'ol/style.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { getVectorContext } from 'ol/render.js';

/**简单动画 */
export default {
    data() {
        return {
            mapObj: null,
            center: [-5639523.95, -3501274.52],
            animating: null,
            speed: null,
            now: null,
            routeLength: null,
            routeCoords: null,
            styles: null,
            geoMarker: null,
            polyline: [
                'hldhx@lnau`BCG_EaC??cFjAwDjF??uBlKMd@}@z@??aC^yk@z_@se@b[wFdE??wFfE}N',
                'fIoGxB_I\\gG}@eHoCyTmPqGaBaHOoD\\??yVrGotA|N??o[N_STiwAtEmHGeHcAkiA}^',
                'aMyBiHOkFNoI`CcVvM??gG^gF_@iJwC??eCcA]OoL}DwFyCaCgCcCwDcGwHsSoX??wI_E',
                'kUFmq@hBiOqBgTwS??iYse@gYq\\cp@ce@{vA}s@csJqaE}{@iRaqE{lBeRoIwd@_T{]_',
                'Ngn@{PmhEwaA{SeF_u@kQuyAw]wQeEgtAsZ}LiCarAkVwI}D??_}RcjEinPspDwSqCgs@',
                'sPua@_OkXaMeT_Nwk@ob@gV}TiYs[uTwXoNmT{Uyb@wNg]{Nqa@oDgNeJu_@_G}YsFw]k',
                'DuZyDmm@i_@uyIJe~@jCg|@nGiv@zUi_BfNqaAvIow@dEed@dCcf@r@qz@Egs@{Acu@mC',
                'um@yIey@gGig@cK_m@aSku@qRil@we@{mAeTej@}Tkz@cLgr@aHko@qOmcEaJw~C{w@ka',
                'i@qBchBq@kmBS{kDnBscBnFu_Dbc@_~QHeU`IuyDrC_}@bByp@fCyoA?qMbD}{AIkeAgB',
                'k_A_A{UsDke@gFej@qH{o@qGgb@qH{`@mMgm@uQus@kL{_@yOmd@ymBgwE}x@ouBwtA__',
                'DuhEgaKuWct@gp@cnBii@mlBa_@}|Asj@qrCg^eaC}L{dAaJ_aAiOyjByH{nAuYu`GsAw',
                'Xyn@ywMyOyqD{_@cfIcDe}@y@aeBJmwA`CkiAbFkhBlTgdDdPyiB`W}xDnSa}DbJyhCrX',
                'itAhT}x@bE}Z_@qW_Kwv@qKaaAiBgXvIm}A~JovAxCqW~WanB`XewBbK{_A`K}fBvAmi@',
                'xBycBeCauBoF}}@qJioAww@gjHaPopA_NurAyJku@uGmi@cDs[eRaiBkQstAsQkcByNma',
                'CsK_uBcJgbEw@gkB_@ypEqDoqSm@eZcDwjBoGw`BoMegBaU_`Ce_@_uBqb@ytBwkFqiT_',
                'fAqfEwe@mfCka@_eC_UmlB}MmaBeWkkDeHwqAoX}~DcBsZmLcxBqOwqE_DkyAuJmrJ\\o',
                '~CfIewG|YibQxBssB?es@qGciA}RorAoVajA_nAodD{[y`AgPqp@mKwr@ms@umEaW{dAm',
                'b@umAw|@ojBwzDaaJsmBwbEgdCsrFqhAihDquAi`Fux@}_Dui@_eB_u@guCuyAuiHukA_',
                'lKszAu|OmaA{wKm}@clHs_A_rEahCssKo\\sgBsSglAqk@yvDcS_wAyTwpBmPc|BwZknF',
                'oFscB_GsaDiZmyMyLgtHgQonHqT{hKaPg}Dqq@m~Hym@c`EuiBudIabB{hF{pWifx@snA',
                'w`GkFyVqf@y~BkoAi}Lel@wtc@}`@oaXi_C}pZsi@eqGsSuqJ|Lqeb@e]kgPcaAu}SkDw',
                'zGhn@gjYh\\qlNZovJieBqja@ed@siO{[ol\\kCmjMe\\isHorCmec@uLebB}EqiBaCg}',
                '@m@qwHrT_vFps@kkI`uAszIrpHuzYxx@e{Crw@kpDhN{wBtQarDy@knFgP_yCu\\wyCwy',
                'A{kHo~@omEoYmoDaEcPiuAosDagD}rO{{AsyEihCayFilLaiUqm@_bAumFo}DgqA_uByi',
                '@swC~AkzDlhA}xEvcBa}Cxk@ql@`rAo|@~bBq{@``Bye@djDww@z_C_cAtn@ye@nfC_eC',
                '|gGahH~s@w}@``Fi~FpnAooC|u@wlEaEedRlYkrPvKerBfYs}Arg@m}AtrCkzElw@gjBb',
                'h@woBhR{gCwGkgCc[wtCuOapAcFoh@uBy[yBgr@c@iq@o@wvEv@sp@`FajBfCaq@fIipA',
                'dy@ewJlUc`ExGuaBdEmbBpBssArAuqBBg}@s@g{AkB{bBif@_bYmC}r@kDgm@sPq_BuJ_',
                's@{X_{AsK_d@eM{d@wVgx@oWcu@??aDmOkNia@wFoSmDyMyCkPiBePwAob@XcQ|@oNdCo',
                'SfFwXhEmOnLi\\lbAulB`X_d@|k@au@bc@oc@bqC}{BhwDgcD`l@ed@??bL{G|a@eTje@',
                'oS~]cLr~Bgh@|b@}Jv}EieAlv@sPluD{z@nzA_]`|KchCtd@sPvb@wSb{@ko@f`RooQ~e',
                '[upZbuIolI|gFafFzu@iq@nMmJ|OeJn^{Qjh@yQhc@uJ~j@iGdd@kAp~BkBxO{@|QsAfY',
                'gEtYiGd]}Jpd@wRhVoNzNeK`j@ce@vgK}cJnSoSzQkVvUm^rSgc@`Uql@xIq\\vIgg@~k',
                'Dyq[nIir@jNoq@xNwc@fYik@tk@su@neB}uBhqEesFjoGeyHtCoD|D}Ed|@ctAbIuOzqB',
                '_}D~NgY`\\um@v[gm@v{Cw`G`w@o{AdjAwzBh{C}`Gpp@ypAxn@}mAfz@{bBbNia@??jI',
                'ab@`CuOlC}YnAcV`@_^m@aeB}@yk@YuTuBg^uCkZiGk\\yGeY}Lu_@oOsZiTe[uWi[sl@',
                'mo@soAauAsrBgzBqgAglAyd@ig@asAcyAklA}qAwHkGi{@s~@goAmsAyDeEirB_{B}IsJ',
                'uEeFymAssAkdAmhAyTcVkFeEoKiH}l@kp@wg@sj@ku@ey@uh@kj@}EsFmG}Jk^_r@_f@m',
                '~@ym@yjA??a@cFd@kBrCgDbAUnAcBhAyAdk@et@??kF}D??OL'
            ].join()

        }
    },
    mounted() {
        window.vue = this
        /** @type {module:ol/geom/LineString~LineString} */
        var route = (new Polyline({
            factor: 1e6
        }).readGeometry(this.polyline, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        }));
        this.routeCoords = route.getCoordinates();
        this.routeLength = this.routeCoords.length;

        var routeFeature = new Feature({
            type: 'route',
            geometry: route
        });
        this.geoMarker = new Feature({
            type: 'geoMarker',
            geometry: new Point(this.routeCoords[0])
        });
        var startMarker = new Feature({
            type: 'icon',
            geometry: new Point(this.routeCoords[0])
        });
        var endMarker = new Feature({
            type: 'icon',
            geometry: new Point(this.routeCoords[this.routeLength - 1])
        });
        this.styles = {
            'route': new Style({
                stroke: new Stroke({
                    width: 6,
                    color: [237, 212, 0, 0.8]
                })
            }),
            'icon': new Style({
                image: new Icon({
                    anchor: [0.5, 1],
                    src: 'data/icon.png'
                })
            }),
            'geoMarker': new Style({
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({ color: 'black' }),
                    stroke: new Stroke({
                        color: 'white',
                        width: 2
                    })
                })
            })
        };

        this.animating = false;
        this.speed;
        this.now;
        var speedInput = document.getElementById('speed');
        var startButton = document.getElementById('start-animation');

        var vectorLayer = new VectorLayer({
            source: new VectorSource({
                features: [routeFeature, this.geoMarker, startMarker, endMarker]
            }),
            style: function(feature) {
                // hide geoMarker if animation is active
                if (window.vue.animating && feature.get('type') === 'geoMarker') {
                    return null;
                }
                return window.vue.styles[feature.get('type')];
            }
        });


        this.mapObj = new Map({
            target: 'map',
            // loadTilesWhileAnimating: true,
            layers: [
                new TileLayer({
                    source: new BingMaps({
                        imagerySet: 'AerialWithLabelsOnDemand',
                        key: 'As1HiMj1PvLPlqc_gtM7AqZfBL8ZL3VrjaS3zIb22Uvb9WKhuJObROC-qUpa81U5'
                    })
                }),
                vectorLayer
            ],
            view: new View({
                center: this.center,
                zoom: 10,
                minZoom: 2,
                maxZoom: 19
            })
        });
       function startAnimation() {
            if (this.animating) {
                this.stopAnimation(false);
            } else {
                var speedInput = document.getElementById('speed');
                var startButton = document.getElementById('start-animation');
                this.animating = true;
                this.now = new Date().getTime();
                this.speed = speedInput.value;
                startButton.textContent = 'Cancel Animation';
                // hide geoMarker
                this.geoMarker.setStyle(null);
                // just in case you pan somewhere else
                this.mapObj.getView().setCenter(this.center);
                this.mapObj.on('postcompose', function(event) {
                    debugger;
                     window.vue.moveFeature(event)
                });
                this.mapObj.render();
            }
        },
       var  moveFeature=function(event) {
            var vectorContext = getVectorContext(event);
            var frameState = event.frameState;

            if (window.vue.animating) {
                var elapsedTime = frameState.time - window.vue.now;
                // here the trick to increase speed is to jump some indexes
                // on lineString coordinates
                var index = Math.round(window.vue.speed * elapsedTime / 1000);

                if (index >= window.vue.routeLength) {
                    window.vue.stopAnimation(true);
                    return;
                }

                var currentPoint = new Point(window.vue.routeCoords[index]);
                var feature = new Feature(currentPoint);
                vectorContext.drawFeature(feature, window.vue.styles.geoMarker);
            }
            // tell OpenLayers to continue the postcompose animation
            window.vue.mapObj.render();
        },
       function stopAnimation(ended) {
            var startButton = document.getElementById('start-animation');
            this.animating = false;
            startButton.textContent = 'Start Animation';

            // if animation cancelled set the marker at the beginning
            var coord = ended ? this.routeCoords[this.routeLength - 1] : this.routeCoords[0];
            /** @type {module:ol/geom/Point~Point} */
            (this.geoMarker.getGeometry())
            .setCoordinates(coord);
            //remove listener
            this.mapObj.un('postcompose', function(event){
                  window.vue.moveFeature(event)
            });
        }

        startButton.addEventListener('click', window.vue.startAnimation, false);
    },
    methods: {
/*
        startAnimation() {
            if (this.animating) {
                this.stopAnimation(false);
            } else {
                var speedInput = document.getElementById('speed');
                var startButton = document.getElementById('start-animation');
                this.animating = true;
                this.now = new Date().getTime();
                this.speed = speedInput.value;
                startButton.textContent = 'Cancel Animation';
                // hide geoMarker
                this.geoMarker.setStyle(null);
                // just in case you pan somewhere else
                this.mapObj.getView().setCenter(this.center);
                this.mapObj.on('postcompose', function(event) {
                    debugger;
                     window.vue.moveFeature(event)
                });
                this.mapObj.render();
            }
        },
        moveFeature(event) {
            var vectorContext = getVectorContext(event);
            var frameState = event.frameState;

            if (window.vue.animating) {
                var elapsedTime = frameState.time - window.vue.now;
                // here the trick to increase speed is to jump some indexes
                // on lineString coordinates
                var index = Math.round(window.vue.speed * elapsedTime / 1000);

                if (index >= window.vue.routeLength) {
                    window.vue.stopAnimation(true);
                    return;
                }

                var currentPoint = new Point(window.vue.routeCoords[index]);
                var feature = new Feature(currentPoint);
                vectorContext.drawFeature(feature, window.vue.styles.geoMarker);
            }
            // tell OpenLayers to continue the postcompose animation
            window.vue.mapObj.render();
        },
        stopAnimation(ended) {
            var startButton = document.getElementById('start-animation');
            this.animating = false;
            startButton.textContent = 'Start Animation';

            
            (this.geoMarker.getGeometry())
            .setCoordinates(coord);
            //remove listener
            this.mapObj.un('postcompose', function(event){
                  window.vue.moveFeature(event)
            });
        }*/
    }
}
</script>