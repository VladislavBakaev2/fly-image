<template>
    <modal-window
        :show="show"
        @update:show="dialogHidden"
        :modalStyle="cssModal"
    >

        <drag-zoom-component
            :img="activePhoto.src"
        >
        <div class="d-flex flex-row justify-content-between text-light m-2">
            <div class="w-50">
                <div class="d-flex flex-row justify-content-between"><div>Название полета</div><div>{{activeFly.name}}</div></div>
                <div class="d-flex flex-row justify-content-between"><div>Дата полета</div><div>{{activeFly.at_fly}}</div></div>
                <div class="d-flex flex-row justify-content-between"><div>Название фото</div><div>{{activePhoto.name}}</div></div>
                <div class="d-flex flex-row justify-content-between"><div>Координаты фото</div><div>{{activePhoto.coords}}</div></div>
            </div>
            <div class="d-flex align-items-center" style="cursor: pointer;"
                @click="dialogHidden"
            >
                <BootstrapIcon
                icon="x-lg"
                size="2x"
                variant="light"
                />
            </div>
        </div>
        </drag-zoom-component>
    </modal-window>
</template>

<script>
import DragZoomComponent from './DragZoomComponent.vue'
import ModalWindow from './ModalWindow.vue'
export default {
    props:{
        show:{
            type: Boolean,
            default: false
        },
        flying:{
            type: Array,
        }
    },
    components: { ModalWindow, DragZoomComponent },
    data(){
        return{
            cssModal:{
                maxWidth: "80%",
                maxHeight: "80%",
            }
        }
    },
    methods:{
        dialogHidden() {
            this.$emit("update:show", false)
        },
    },
    computed:{
        activePhoto(){
            for(let i=0; i< this.flying.length; i++){
                for(let j=0; j<this.flying[i].photos.length; j++){
                    if(this.flying[i].photos[j].active){
                        return this.flying[i].photos[j]
                    }
                }
            }
            return undefined
        },
        activeFly(){
            for(let i=0; i< this.flying.length; i++){
                for(let j=0; j<this.flying[i].photos.length; j++){
                    if(this.flying[i].photos[j].active){
                        return this.flying[i]
                    }
                }
            }
            return undefined   
        }
    }
}
</script>

<style scoped>

</style>