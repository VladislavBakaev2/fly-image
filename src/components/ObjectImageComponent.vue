<template>
    <modal-window
        :show="show"
        @update:show="dialogHidden"
        :modalStyle="cssModal"
    >
        <drag-zoom-component
            :img="object.objects[target_object_id].ref_photo"
            :start_rect="object.objects[target_object_id].rect"
        >
            <div class="d-flex flex-column text-light">
                <div class="d-flex flex-row align-items-center justify-content-center">
                    <div><button type="button" class="btn btn-outline-secondary" @click="target_object_id--" :disabled="target_object_id==0">-</button></div>
                    <div class="m-3" >{{target_object_id+1}}/{{object.objects.length}}</div>
                    <div><button type="button" class="btn btn-outline-secondary" @click="target_object_id++" :disabled="target_object_id==object.objects.length-1">+</button></div>
                </div>
                <div class="d-flex flex-row justify-content-between">
                    <div class="w-50">
                        <div class="d-flex flex-row justify-content-between"><div>Название объекта</div><div>{{object.name}}</div></div>
                        <div class="d-flex flex-row justify-content-between"><div>Дата создания объекта</div><div>{{object.at_first}}</div></div>
                        <div class="d-flex flex-row justify-content-between"><div>Дата последней записи</div><div>{{object.at_last}}</div></div>
                        <div class="d-flex flex-row justify-content-between"><div>Комментарий</div><div>{{object.commentary}}</div></div>
                        <div class="d-flex flex-row justify-content-between"><div>Координаты</div><div>{{object.coords}}</div></div>
                        <div class="d-flex flex-row justify-content-between"><div>Дата создания записи</div><div>{{object.objects[target_object_id].at_create}}</div></div>
                        <div class="d-flex flex-row justify-content-between"><div>Дополнительный комментарий</div><div>{{object.objects[target_object_id].commentary}}</div></div>
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
        object:{
            type: Object
        }
    },
    components: { ModalWindow, DragZoomComponent },

    data(){
        return{
            cssModal:{
                maxWidth: "80%",
                maxHeight: "80%",
            },
            target_object_id: null
        }
    },
    methods:{
        dialogHidden() {
            this.$emit("update:show", false)
        },
    },
    watch:{
        object(){
            if(this.object){
                this.target_object_id = this.object.objects.length-1
            }
        }
    }
}
</script>

<style>

</style>