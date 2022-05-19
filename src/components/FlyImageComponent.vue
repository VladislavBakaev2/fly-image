<template>
    <modal-window
        :show="show"
        @update:show="dialogHidden"
        :modalStyle="cssModal"
    >

        <drag-zoom-component
            :img="activePhoto.photo.src"
            v-model:drawn_rectangle="drawn_rectangle"
        >
        <div class="data-style d-flex flex-column align-items-center">
            <div class="d-flex flex-row text-light w-100">
                <div class="d-flex flex-row justify-content-between w-100">
                    <div class="w-50 m-3">
                        <div class="d-flex flex-row justify-content-between"><div>Название полета</div><div>{{activePhoto.fly.name}}</div></div>
                        <div class="d-flex flex-row justify-content-between"><div>Дата полета</div><div>{{activePhoto.fly.at_fly}}</div></div>
                        <div class="d-flex flex-row justify-content-between"><div>Название фото</div><div>{{activePhoto.photo.name}}</div></div>
                        <div class="d-flex flex-row justify-content-between"><div>Координаты фото</div><div>{{activePhoto.photo.coords}}</div></div>
                    </div>
                    <div class="w-50 m-3">
                        <div class="d-flex flex-row justify-content-between"><div>Автор</div><div>{{activePhoto.fly.author}}</div></div>
                        <div class="d-flex flex-row justify-content-between"><div>Робот для съемки</div><div>{{activePhoto.fly.robot_type}}</div></div>
                        <div class="d-flex flex-row justify-content-between"><div>Камера для съемки</div><div>{{activePhoto.fly.camera_type}}</div></div>
                        <div class="d-flex flex-row justify-content-between"><div>Комментарий</div><div class="commentary-style">{{activePhoto.fly.commentary}}</div></div>
                    </div>
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
            <div v-if="$store.state.account.status.loggedIn" class="d-flex flex-column w-50">
                <div class="d-flex flex-row justify-content-between mb-1">
                    <label for="name" class="text-white">Название объекта</label>
                    <input v-model="object.name" name="name" style="width:40%" :disabled="drawn_rectangle==null"/>
                </div>
                <div class="d-flex flex-row justify-content-between mb-1">
                    <label for="comment" class="text-white">Комментарий</label>
                    <textarea v-model="object.commentary" rows="2" name="comment" class="commentary-style" style="width:40%" :disabled="drawn_rectangle==null"/>
                </div>
                <button type="button" :disabled="drawn_rectangle==null" class="btn button-style w-50" @click="createObjectEvent">Сохранить объект</button>
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
        },
    },
    components: { ModalWindow, DragZoomComponent },
    data(){
        return{
            cssModal:{
                maxWidth: "80%",
                maxHeight: "90%",
                overflow: 'hidden'
            },
            drawn_rectangle: null,
            object:{
                name: '',
                commentary: ''
            }
        }
    },
    methods:{
        dialogHidden() {
            this.$emit("update:show", false)
            this.drawn_rectangle = null
        },
        createObjectEvent(){
            this.$emit('createObject',  {...this.object, rect:this.drawn_rectangle})
            this.dialogHidden()
        }
    },
    computed:{
        activePhoto(){
            for(let i=0; i< this.flying.length; i++){
                for(let j=0; j<this.flying[i].photos.length; j++){
                    if(this.flying[i].photos[j].active){
                        return {
                            photo: this.flying[i].photos[j],
                            fly: this.flying[i]
                        }
                    }
                }
            }
            return undefined
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
    background: -webkit-linear-gradient(0deg, rgb(43, 43, 43, 0.8) 27%, rgba(95, 95, 95, 0.8));
    background: -moz-linear-gradient(0deg, rgb(43, 43, 43, 0.8) 27%, rgb(95, 95, 95, 0.8));
    background: linear-gradient(0deg, rgb(43, 43, 43, 0.8) 27%, rgb(95, 95, 95, 0.8));
}
.button-style{
    width: 20%;
    align-self: center;
    background-color: #525252;
    color: white;
}
</style>