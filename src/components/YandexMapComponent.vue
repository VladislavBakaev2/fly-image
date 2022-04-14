<template>
    <yandex-map 
        :settings="settings"
        :coords="center"
        style="width: 100%; height:100%"
        :zoom="zoom"
        :controls="controls"
        :detailedControls="detailedControls"
        map-type="hybrid"
    >
    </yandex-map> 
</template>

<script>
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
            detailedControls: {'typeSelector': {position:{top:70, right:0}}}
        }
    }
}
</script>

<style>

</style>