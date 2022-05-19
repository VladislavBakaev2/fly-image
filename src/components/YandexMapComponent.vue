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
            @click="flyOpen(fly)"
            @contextmenu="openContextMenu($event, fly)"
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
                @balloonopen="balloonOpenFly('point'+fly.id+':'+point.id, point.id, fly.id)"
                @ballonclose="ballonCloseFly('point'+fly.id+':'+point.id, point.id, fly.id)"
                @contextmenu="closeFly(fly)"
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
            @balloonopen="balloonOpenObject(object.id, 'object:'+object.id)"
            @ballonclose="ballonCloseObject('object:'+object.id)"
            @contextmenu="rightClickObject($event, object.id)"
        />
        <context-menu-component :display="contextMenuParams.showContextMenu" ref="menu">
            <div class="list-group small">
                <a @click="contextEditEvent" class="list-group-item list-group-item-action">Добавить новые фотографии</a>
                <a @click="contextDeleteEvent" class="list-group-item list-group-item-action">Удалить полет</a>
            </div>
        </context-menu-component>
    </yandex-map> 
</template>

<script>
import axios from "axios"
import { yandexMap, ymapMarker} from 'vue-yandex-maps'
import ContextMenuComponent from './ContextMenuComponent.vue'


export default {
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
            active_photo:{
                fly_id: null,
                photo_id: null
            },
            active_object:{
                id: null
            },
            contextMenuParams:{
                showContextMenu: false,
                target: null
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
        balloonTemplateFly(point, fly,index){
            return `
                <h5>${point.name}</h5>
                <p>lat:${point.coords[0]} lon:${point.coords[1]}</p>
                <img style='cursor: pointer;' id="${index}" height="100" src="${point.src}">
                <div>Дата полета: ${fly.at_fly}</div>
            `
        },
        balloonOpenFly(index, point_id, fly_id){
            document.getElementById(index).addEventListener('click', this.clickImageFly);
            this.active_photo.fly_id = fly_id
            this.active_photo.photo_id = point_id
        },
        ballonCloseFly(index){
            document.getElementById(index).removeEventListener('click', this.clickImageFly);  
        },
        clickImageFly(){
            this.$emit('clickImage', this.active_photo)
        },
        flyOpen(fly){
            this.$emit('deployFlyChange', {id: fly.id, deployed: true})
        },
        closeFly(fly){
            this.$emit('deployFlyChange', {id: fly.id, deployed: false})
        },

        balloonTemplateObject(object, id){
            return `
                <h5>${object.name}</h5>
                <p>lat:${object.coords[0]} lon:${object.coords[1]}</p>
                <img style='cursor: pointer;' id="${id}" height="100" src="${object.objects[object.objects.length-1].ref_photo}">
                <div>Дата создания: ${object.at_first}</div>
                <div>Количество записей: ${object.objects.length}</div>
            `
        },
        balloonOpenObject(object_id, index){
            document.getElementById(index).addEventListener('click', this.clickImageObject);
            this.active_object.id = object_id
        },
        ballonCloseObject(index){
            document.getElementById(index).removeEventListener('click', this.clickImageObject);  
        },
        clickImageObject(){
            this.$emit('clickObject', this.active_object)
        },

        changeZoom(event){
            this.$emit('update:zoom', event.originalEvent.newZoom)
        },
        changeCenterMap(event){
            this.$emit('update:center', event.originalEvent.newCenter)
        },
        openContextMenu(e, fly) {
            this.$refs.menu.open(e);
            this.contextMenuParams.target = fly
        },
        contextDeleteEvent(){
            console.log('delete')
        },
        contextEditEvent(){
            this.$emit('editFly', this.contextMenuParams.target)
        },
        rightClickObject(e, object_id){
            this.$emit('rightClickObject', object_id)
        },
        rightClickMap(e){
            if(e.which==3){
                setTimeout(this.$emit('rightClickMap', {}),200)
            }
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