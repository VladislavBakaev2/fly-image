<template>
    <yandex-map 
        :settings="settings"
        :coords="center"
        style="width: 100%; height:100%"
        :zoom="zoom"
        :controls="controls"
        :detailedControls="detailedControls"
        :mapEvents="defaultMapEvents"
        @mousemove="moveMouse"
        map-type="hybrid"
    >
    </yandex-map> 
</template>

<script>
import axios from "axios"
import { yandexMap } from 'vue-yandex-maps'

export default {
    components:{
        yandexMap
    },
    data() {
        return {
            settings: {
                    apiKey: '',
                    lang: 'ru_RU',
                    coordorder: 'latlong',
                    enterprise: false,
                    version: '2.1'
            },
            center: [55.737722, 37.732367],
            zoom: 10,
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
            
            countMouseMsg: 0
        }
    },
    methods:{
        moveMouse(e){
            if(this.countMouseMsg !=20){
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
        }
    }
}
</script>

<style>

</style>