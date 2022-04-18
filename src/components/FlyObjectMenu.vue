<template>
    <div class="position-fixed fixed-bottom">
        <map-element-component
            v-model:open="object_menu.open"
            :activeButton="object_swipe_button_state"
            @clickLeft="objectClickLeft"
            @clickRight="objectClickRight"
        >
            <object-component
                v-for="object in visible_objects"
                :key="object.id"
                :object="object"
            />
        </map-element-component>
        <map-element-component
            v-model:open="fly_menu.open"
            :activeButton="fly_swipe_button_state"
            @clickLeft="flyClickLeft"
            @clickRight="flyClickRight"
        >
            <fly-component
                v-for="fly in visible_flying"
                :key="fly.id"
                :fly="fly"
            />
        </map-element-component>
    </div>
</template>

<script>
import MapElementComponent from '@/components/MapElementComponent.vue'
import ObjectComponent from './ObjectComponent.vue'
import FlyComponent from './FlyComponent.vue'

export default {
    props:{
        objects:{
            type: Array,
        },
        flying:{
            type: Array,
        }
    },
    components: { 
        MapElementComponent,
        ObjectComponent,
        FlyComponent,
    },
    data(){
        return{
            fly_menu:{
                open: true,
                swipe_fly_parameters:{
                    max_element: 4,
                    first_element: 0
                }
            },
            object_menu:{
                open: true,
                swipe_objects_parameters:{
                    max_element: 4,
                    first_element: 0
                }
            },
        }
    },
    computed:{
        visible_objects(){
            let result;
            let end_elem = this.object_menu.swipe_objects_parameters.first_element+this.object_menu.swipe_objects_parameters.max_element;
            if(end_elem>this.objects.length){
                result = this.objects.slice(this.object_menu.swipe_objects_parameters.first_element)
            }
            else{
                result = this.objects.slice(this.object_menu.swipe_objects_parameters.first_element, end_elem)
            }
            return result
        },
        visible_flying(){
            let result;
            let end_elem = this.fly_menu.swipe_fly_parameters.first_element+this.fly_menu.swipe_fly_parameters.max_element;
            if(end_elem>this.flying.length){
                result = this.flying.slice(this.fly_menu.swipe_fly_parameters.first_element)
            }
            else{
                result = this.flying.slice(this.fly_menu.swipe_fly_parameters.first_element, end_elem)
            }
            return result
        },
        object_swipe_button_state(){
            let state = {}
            state.left = this.object_menu.swipe_objects_parameters.first_element != 0
            state.right = (this.object_menu.swipe_objects_parameters.first_element+this.object_menu.swipe_objects_parameters.max_element)<this.objects.length
            return state
        },
        fly_swipe_button_state(){
            let state = {}
            state.left = this.fly_menu.swipe_fly_parameters.first_element != 0
            state.right = (this.fly_menu.swipe_fly_parameters.first_element+this.fly_menu.swipe_fly_parameters.max_element)<this.flying.length
            return state
        }
    },
    methods:{
        objectClickLeft(){
            this.object_menu.swipe_objects_parameters.first_element -=1
        },
        objectClickRight(){
            this.object_menu.swipe_objects_parameters.first_element +=1
        },
        flyClickLeft(){
            this.fly_menu.swipe_fly_parameters.first_element -=1
        },
        flyClickRight(){
            this.fly_menu.swipe_fly_parameters.first_element +=1
        }
    }
}
</script>

<style>

</style>