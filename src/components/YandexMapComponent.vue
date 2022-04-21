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
            @click="flyOpen(fly)"
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
                :balloon-template="balloonTemplate(point, fly,'point'+fly.id+':'+point.id)"
                @balloonopen="balloonOpen('point'+fly.id+':'+point.id, point.id, fly.id)"
                @ballonclose="ballonClose('point'+fly.id+':'+point.id, point.id, fly.id)"
                @contextmenu="closeFly(fly)"
            />
        </div>

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
                },
                photos:{
                    groupByCoordinates: false,
                    clusterHideIconOnBalloonOpen: false,
                    gridSize: 10,
                    geoObjectHideIconOnBalloonOpen: false,
                    preset: 'islands#redClusterIcons'
                }
            },
            active_photo:{
                fly_id: null,
                photo_id: null
            }
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
        balloonTemplate(point, fly,index){
            return `
                <h5>${point.name}</h5>
                <p>lat:${point.coords[0]} lon:${point.coords[1]}</p>
                <img style='cursor: pointer;' id="${index}" height="100" src="${point.src}">
                <div>Дата полета: ${fly.at_fly}</div>
            `
        },
        balloonOpen(index, point_id, fly_id){
            document.getElementById(index).addEventListener('click', this.clickImage);
            this.active_photo.fly_id = fly_id
            this.active_photo.photo_id = point_id
        },
        ballonClose(index){
            document.getElementById(index).removeEventListener('click', this.clickImage);  
        },
        clickImage(){
            this.$emit('clickImage', this.active_photo)
        },
        flyOpen(fly){
            this.$emit('deployFlyChange', {id: fly.id, deployed: true})
        },
        closeFly(fly){
            this.$emit('deployFlyChange', {id: fly.id, deployed: false})
        }
    },
    computed:{
        nonDeployedFlying(){
            return this.flying.filter(fly=>!fly.deployed)
        },
        deployedFlying(){
            return this.flying.filter(fly=>fly.deployed)
        }
    },
    watch:{
        nonDeployedFlying(){
            this.key +=1
        }
    }
}
</script>

<style scoped>
.class{
    cursor: pointer;
}
</style>