<template>
    <modal-window
        :show="show"
        @update:show="dialogHidden"
        :modalStyle="cssModal"
    >
        <drag-zoom-component
            :img="targetObject.ref_photo"
            :start_rect="targetObject.rect"
        >
            <div class="data-style d-flex flex-column text-light">
                <div class="d-flex flex-row" style="margin-bottom: 10px">
                    <div class="d-flex flex-row justify-content-between w-100">
                        <div class="w-50 d-flex flex-column" style="margin-right: 10px">
                            <div class="d-flex flex-row justify-content-between"><div>Название объекта</div><div>{{object.name}}</div></div>
                            <div class="d-flex flex-row justify-content-between"><div>Дата создания объекта</div><div>{{object.at_first}}</div></div>
                            <div class="d-flex flex-row justify-content-between"><div>Дата последней записи</div><div>{{object.at_last}}</div></div>
                            <div class="d-flex flex-row justify-content-between"><div>Комментарий</div><div class="commentary-style">{{object.commentary}}</div></div>
                            <button v-if="$store.state.account.status.loggedIn" type="button" class="btn button-style" @click="deleteAllObjectEvent">Удалить все записи и объект</button>
                        </div>
                        <div class="w-50 d-flex flex-column" style="margin-left: 10px">
                            <div class="d-flex flex-row justify-content-between"><div>Координаты</div><div>{{object.coords}}</div></div>
                            <div class="d-flex flex-row justify-content-between"><div>Автор записи</div><div>{{object.objects[target_object_id].author}}</div></div>
                            <div class="d-flex flex-row justify-content-between"><div>Дата создания текущей записи</div><div>{{object.objects[target_object_id].at_create}}</div></div>
                            <div class="d-flex flex-row justify-content-between"><div>Комментарий к текущей записи</div><div class="commentary-style">{{object.objects[target_object_id].commentary}}</div></div>
                            <button v-if="$store.state.account.status.loggedIn" type="button" class="btn button-style" @click="deleteObjectEvent" :disabled="object.objects.length==1" >Удалить текущую запись об объекте</button>
                        </div>
                    </div>
                    <div class="d-flex align-items-center" style="cursor: pointer; margin-left: 10px;"
                        @click="dialogHidden"
                    >
                        <BootstrapIcon
                        icon="x-lg"
                        size="2x"
                        variant="light"
                        />
                    </div>
                </div>
                <div class="d-flex flex-row align-items-center justify-content-center">
                    <div>
                        <button type="button" class="btn btn-outline-secondary" @click="target_object_id--" :disabled="target_object_id==0">
                            <BootstrapIcon
                                :icon="target_object_id==0?'caret-left':'caret-left-fill'"
                                size="md"
                                variant="light"
                            />
                        </button>
                    </div>
                    <div class="m-1" >{{target_object_id+1}}/{{object.objects.length}}</div>
                    <div>
                        <button type="button" class="btn btn-outline-secondary" @click="target_object_id++" :disabled="target_object_id==object.objects.length-1">
                            <BootstrapIcon
                                :icon="target_object_id==object.objects.length-1?'caret-right':'caret-right-fill'"
                                size="md"
                                variant="light"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </drag-zoom-component>
    </modal-window>
</template>

<script>
import DragZoomComponent from './UI/DragZoomComponent.vue'
import ModalWindow from './UI/ModalWindow.vue'
import { mapGetters } from 'vuex'

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
                maxHeight: "90%",
                overflow: 'hidden'
            },
            target_object_id: null
        }
    },
    methods:{
        dialogHidden() {
            this.$emit("update:show", false)
        },
        deleteObjectEvent(){
            const headers =  {
                headers: {'Authorization': 'Bearer ' + this.STATE.token.token},
                data: {id: this.targetObject.id}
            }
            this.$http.delete('/api/object/delete', headers).then((response)=>{
                if(response.status==200){
                    alert(`Запись удалена`)
                    if(this.target_object_id==this.target_object_id==this.object.objects.length-1){
                        this.target_object_id--
                        this.$emit('deleteObjectElemEvent', {id: this.object.id, arr_id: this.target_object_id+1})
                    }
                    else{
                        this.$emit('deleteObjectElemEvent', {id: this.object.id, arr_id: this.target_object_id})
                    }
                }
            }).catch((error)=>{
                if (error.response.status == 400 && error.response.data.error=="forbiden"){
                    alert('Недостаточно прав для удаления выбранного объекта. Удалить объект может только его создатель.')
                }
            })
        },
        deleteAllObjectEvent(){
            const headers =  {
                headers: {'Authorization': 'Bearer ' + this.STATE.token.token},
                data: {id: this.object.id}
            }
            this.$http.delete('/api/objects/delete', headers).then((response)=>{
                if(response.status==200){
                    alert(`Все записи удалены удалена`)
                    this.$emit('deleteObjectElemEvent', {id: this.object.id})
                    this.dialogHidden()
                }
            }).catch((error)=>{
                if (error.response.status == 400 && error.response.data.error=="forbiden"){
                    alert('Недостаточно прав для удаления выбранного объекта. Удалить объект может только его создатель.')
                }
            })
        }
    },
    computed:{
        targetObject(){
            return this.object.objects[this.target_object_id]
        },
        ...mapGetters('account',['STATE']),
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

<style scoped>
.commentary-style{
    width: 300px;
    height: 50px;
    overflow-y: scroll;
    border: 1px solid gray;
    border-radius: 5px;
    margin-left: 30px;
    padding: 5px;
}
.data-style{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 10px;
    background: -webkit-linear-gradient(0deg, rgb(43, 43, 43, 0.8) 27%, rgba(95, 95, 95, 0.8));
    background: -moz-linear-gradient(0deg, rgb(43, 43, 43, 0.8) 27%, rgb(95, 95, 95, 0.8));
    background: linear-gradient(0deg, rgb(43, 43, 43, 0.8) 27%, rgb(95, 95, 95, 0.8));
}
.button-style{
    width: 50%;
    align-self: center;
    background-color: #525252!important;
    color: white!important;
    margin-top: 10px
}
</style>