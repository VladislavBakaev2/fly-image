<template>
    <div class="position-fixed fixed-bottom">
        <map-element-component
            v-model:open="open1"
        >
        </map-element-component>
        <map-element-component
            v-model:open="open2"
        />
    </div>
</template>

<script>
import MapElementComponent from '@/components/MapElementComponent.vue'
export default {
    components: { MapElementComponent },
    data(){
        return{
            open1: true,
            open2: false
        }
    }
}
</script>

<style>

</style>