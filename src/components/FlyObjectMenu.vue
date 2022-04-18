<template>
    <div class="position-fixed fixed-bottom">
        <map-element-component
            v-model:open="open1"
            :activeButton="object_swipe_button_state"
            @clickLeft="clickLeft"
            @clickRight="clickRight"
        >
            <object-component
                v-for="object in visible_objects"
                :key="object.id"
            />
        </map-element-component>
        <map-element-component
            v-model:open="open2"
            :activeButton="fly_swipe_button_state"
        />
    </div>
</template>

<script>
import MapElementComponent from '@/components/MapElementComponent.vue'
import ObjectComponent from './ObjectComponent.vue'

export default {
    components: { 
        MapElementComponent,
        ObjectComponent
    },
    data(){
        return{
            open1: true,
            open2: false,
            // object_swipe_button_state: {
            //     left: true,
            //     right: true
            // },
            fly_swipe_button_state: {
                left: true,
                right: true
            },

            objects:[
                {id:1},
                {id:2},
                {id:3},
                {id:4},
                {id:5},

            ],
            swipe_objects_parameters:{
                max_element: 3,
                first_element: 1
            }
        }
    },
    computed:{
        visible_objects(){
            let result;
            let end_elem = this.swipe_objects_parameters.first_element+this.swipe_objects_parameters.max_element;
            if(end_elem>this.objects.length){
                result = this.objects.slice(this.swipe_objects_parameters.max_element)
            }
            else{
                result = this.objects.slice(this.swipe_objects_parameters.first_element, end_elem)
            }
            return result
        },
        object_swipe_button_state(){
            let state = {}
            state.left = this.swipe_objects_parameters.first_element != 0
            state.right = (this.swipe_objects_parameters.first_element+this.swipe_objects_parameters.max_element)<this.objects.length
            return state
        }
    },
    methods:{
        clickLeft(){
            this.swipe_objects_parameters.first_element -=1
        },
        clickRight(){
            this.swipe_objects_parameters.first_element +=1
        }
    }
}
</script>

<style>

</style>