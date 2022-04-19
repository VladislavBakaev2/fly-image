<template>
    <yandex-map
        :key="key"
        :settings="map_settings.settings"
        v-model:coords="map_parameters.center"
        style="width: 100%; height:100%"
        :controls="map_settings.controls"
        :detailedControls="map_settings.detailedControls"
        :mapEvents="map_settings.defaultMapEvents"
        @mousemove="moveMouse"
        map-type="hybrid"
        :cluster-options="clusterOptions"
        v-model:zoom="map_parameters.zoom"
    >
        <ymap-marker
            v-for="fly in nonDeployedFlying"
            :marker-id="fly.name+':'+fly.id"
            :key="fly.id"
            :coords="fly.photos[0].coords"
            :icon="{content: `${fly.name}`}"
            :clusterName="'flying'"
            @click="flyClick(fly)"
        />
        <!-- <ymap-marker
            v-for="(point, index) in fly"
            :key="point.id"
            :marker-id="point.id"
            :coords="point.coords"
            :icon="{content:`${point.name}`}"
            :balloon-template="balloonTemplate(point.photo, index)"
            @balloonopen="balloonOpen(index)"
            @ballonclose="ballonClose(index)"
        >
        </ymap-marker> -->
    </yandex-map> 
</template>

<script>
import axios from "axios"
import { yandexMap, ymapMarker} from 'vue-yandex-maps'

export default {
    components:{
        yandexMap,
        ymapMarker,
    },
    props:{
        flying:{
            type: Array
        },
        objects:{
            type:Array
        }
    },
    data() {
        return {
            key:0,
            map_settings:{
                settings: {
                    apiKey: '',
                    lang: 'ru_RU',
                    coordorder: 'latlong',
                    enterprise: false,
                    version: '2.1'
                },
                controls: ['rulerControl', 'typeSelector', 'zoomControl'],
                detailedControls: {'typeSelector': {position:{top:90, right:0}}},
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
            map_parameters:{
                center: [55.737722, 37.732367],
                zoom: 10,
            },
            countMouseMsg: 0,
            clusterOptions: {
                flying:{
                    groupByCoordinates: false,
                    clusterHideIconOnBalloonOpen: false,
                    gridSize: 200,
                    geoObjectHideIconOnBalloonOpen: false,
                }
            },
        }
    },
    methods:{
        moveMouse(e){
            if(this.countMouseMsg !=10){
                this.countMouseMsg +=1
                return
            }
            this.countMouseMsg = 0
            let ll
            try{
                ll = e.get('coords')
                ll[0] = ll[0].toFixed(4)
                ll[1] = ll[1].toFixed(4)
            }
            catch{
                return
            }
            axios.get(`https://api.airmap.com/elevation/v1/ele/?points=${ll[0]},${ll[1]}`).then((response)=>{
                if(response.status == 200){
                    this.$emit('update:mouseCoord', [...ll,response.data.data[0]])
                }
            })
        },
        balloonTemplate(src, index){
            return `
                <img id="${index}" height="100" src="${src}">
            `
        },
        balloonOpen(index){
            document.getElementById(index).addEventListener('click', this.clickImage);
        },
        ballonClose(index){
            document.getElementById(index).removeEventListener('click', this.clickImage);  
        },
        clickImage(){
            console.log('image')
        },
        flyClick(fly){
            this.$emit('deployFly', fly.id)
        }
    },
    computed:{
        nonDeployedFlying(){
            return this.flying.filter(project=>!project.deployed)
        }
    },
    watch:{
        nonDeployedFlying(){
            this.key +=1
        }
    }
}
</script>

<style>

</style>