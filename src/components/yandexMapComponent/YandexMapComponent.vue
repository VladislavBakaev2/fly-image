<template>
    <yandex-map
        :key="key"
        :settings="map_settings.settings"
        style="width: 100%; height:100%"
        :controls="map_settings.controls"
        :detailedControls="map_settings.detailedControls"
        :mapEvents="map_settings.defaultMapEvents"
        @mousemove="moveMouse"
        map-type="hybrid"
        :cluster-options="clusterOptions"
        :zoom="zoom"
        :coords="center"
        @boundschange="changeZoom($event), changeCenterMap($event)"
        @mouseup="rightClickMap"
    >
        <ymap-marker
            v-for="fly in nonDeployedFlying"
            :marker-id="fly.name+':'+fly.id"
            :key="fly.id"
            :coords="fly.photos[0].coords"
            :icon="{content: `${fly.name}`}"
            :clusterName="'flying'"
            @click="flyOpenEmit(fly)"
            @contextmenu="openContextMenuEvent($event, fly)"
        />
        <div v-for="fly in deployedFlying"
            :key="fly.id"
        >
            <ymap-marker
                v-for="point in fly.photos"
                :clusterName="'photos'"
                :key="fly.id+':'+point.id"
                :id="'point'+fly.id+':'+point.id"
                :marker-id="'point'+fly.id+':'+point.id"
                :coords="point.coords"
                :icon="{content:`${point.name}`, color:'red'}"
                :balloon-template="balloonTemplateFly(point, fly,'point'+fly.id+':'+point.id)"
                @balloonopen="balloonOpenFlyEvent('point'+fly.id+':'+point.id, point.id, fly.id)"
                @ballonclose="ballonCloseFlyEvent('point'+fly.id+':'+point.id, point.id, fly.id)"
                @contextmenu="closeFlyEmit(fly)"
            />
            <ymap-marker 
                marker-type="polyline"
                :coords="fly.images_coords"
                :marker-id="Date.now()" 
                :marker-stroke="{color: '#0044ff', width: 3}"
            />
        </div>
        <ymap-marker
            v-for="object in objects"
            :marker-id="object.name+''+object.id"
            :key="object.id"
            :coords="object.coords"
            :icon="{content: `${object.name}`, color: 'yellow'}"
            clusterName="objects"
            :balloon-template="balloonTemplateObject(object, 'object:'+object.id)"
            @balloonopen="balloonOpenObjectEvent(object.id, 'object:'+object.id)"
            @ballonclose="ballonCloseObjectEvent('object:'+object.id)"
            @contextmenu="rightClickObject($event, object.id)"
        />
        <context-menu-component  ref="menu">
            <div class="list-group small">
                <a @click="contextEditEvent" class="list-group-item list-group-item-action">Добавить новые фотографии</a>
                <a @click="contextDeleteEvent" class="list-group-item list-group-item-action">Удалить полет</a>
            </div>
        </context-menu-component>
    </yandex-map> 
</template>

<script>
import { yandexMap, ymapMarker} from 'vue-yandex-maps'
import ContextMenuComponent from '../UI/ContextMenuComponent.vue'

import axios from "axios"

import {useFlyingMapApi} from './flying.js'
import {useObjectMapApi} from './object.js'

export default {
    setup(props, context){
        const objectMapApi = useObjectMapApi(context)
        const flyMapApi = useFlyingMapApi(props, context)
        return {...flyMapApi, ...objectMapApi}
    },
    components:{
        yandexMap,
        ymapMarker,
        ContextMenuComponent,
    },
    props:{
        flying:{
            type: Array
        },
        objects:{
            type:Array
        },
        zoom:{
            type:Number
        },
        center:{
            type:Array
        }
    },
    data() {
        return {
            countMouseMsg: 0,
            map_settings:{
                settings: {
                    apiKey: '',
                    lang: 'ru_RU',
                    coordorder: 'latlong',
                    enterprise: false,
                    version: '2.1'
                },
                controls: ['rulerControl', 'typeSelector', 'zoomControl'],
                detailedControls: {'typeSelector': {position:{top:52, right:252}}},
                defaultMapEvents: [
                    'actionend',
                    'balloonclose',
                    'balloonopen',
                    'click',
                    'contextmenu',
                    'dblclick',
                    'destroy',
                    'hintclose',
                    'hintopen',
                    'optionschange',
                    'sizechange',
                    'typechange',
                    'mousemove'
                ],
            },
            clusterOptions: {
                flying:{
                    groupByCoordinates: false,
                    clusterHideIconOnBalloonOpen: false,
                    gridSize: 200,
                    geoObjectHideIconOnBalloonOpen: false,
                },
                photos:{
                    groupByCoordinates: false,
                    clusterHideIconOnBalloonOpen: false,
                    gridSize: 5,
                    geoObjectHideIconOnBalloonOpen: false,
                    preset: 'islands#redClusterIcons'
                },
                objects:{
                    groupByCoordinates: false,
                    clusterHideIconOnBalloonOpen: false,
                    gridSize: 200,
                    geoObjectHideIconOnBalloonOpen: false,
                    preset: 'islands#yellowClusterIcons'  
                }
            },
        }
    },
    methods:{

        changeZoom(event){
            this.$emit('update:zoom', event.originalEvent.newZoom)
        },
        changeCenterMap(event){
            this.$emit('update:center', event.originalEvent.newCenter)
        },
        moveMouse(e){
        if(this.countMouseMsg !=10){
            this.countMouseMsg +=1
            return
        }
        this.countMouseMsg = 0
        let ll
        try{
            ll = e.get('coords')
            ll[0] = ll[0].toFixed(7)
            ll[1] = ll[1].toFixed(7)
        }
        catch{
            return
        }
        axios.get(`https://api.airmap.com/elevation/v1/ele/?points=${ll[0]},${ll[1]}`).then((response)=>{
            if(response.status == 200){
                this.$emit('update:mouseCoord', [...ll,response.data.data[0]])
            }
        })
        }
    },
    watch:{
        objects(){
            setTimeout(this.key+=1, 100)
        }
    }
}
</script>

<style scoped>
.class{
    cursor: pointer;
}
</style>