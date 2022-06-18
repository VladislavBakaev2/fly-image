<template>
    <modal-window
        :show="show"
        :modalStyle="cssModal"
    >
        <div class="content-style d-flex flex-column align-items-center text-light p-2">
            <div class="d-flex align-self-end" style="cursor: pointer;"
                @click="dialogHidden"
            >
                <BootstrapIcon
                icon="x-lg"
                size="2x"
                variant="light"
                />
            </div>
            <div v-if="invalidImages.length!=0" class="error-feedback text-danger">Для некоторых фотографий не удалось найти координаты</div>
            <div v-if="errors" class="error-feedback text-danger">{{errors}}</div>

            <div class="d-flex flex-column" style="width: 70%">
                <div class="d-flex flex-row justify-content-between mb-1">
                    <label for="name">Название полета <span class="reqired-field-style">(обязательное поле)</span></label>
                    <input v-model="flyParams.flyName" type="text" name="name" style="width:40%"/>
                </div>
                <div class="d-flex flex-row justify-content-between mb-1">
                    <label for="robot">Тип робота</label>
                    <input v-model="flyParams.robot" type="text" name="robot" style="width:40%"/>
                </div>
                <div class="d-flex flex-row justify-content-between mb-1">
                    <label for="camera">Камера для съемки</label>
                    <input v-model="flyParams.camera" type="text" name="camera" style="width:40%"/>
                </div>
                <div class="d-flex flex-row justify-content-between mb-1">
                    <label for="date">Дата полета <span class="reqired-field-style">(обязательное поле)</span></label>
                    <Datepicker v-model="flyParams.flyDate" style="width:40%"></Datepicker>
                </div>
                <div class="d-flex flex-row justify-content-between mb-1">
                    <label for="comment">Комментарий</label>
                    <textarea v-model="flyParams.commentary" rows="2" name="comment" style="width:40%"/>
                </div>
                
                <div v-if="!editFly" class="d-flex flex-row justify-content-between mb-1">
                    <label for="control_file">Файл .txt с указанием координат фотографий:</label>
                    <div style="width:40%" class="d-flex flex-row justify-content-between">
                        <input @change="uploadTxtFile" @input="beforeinput" type="file" name="control_file" accept=".txt"/>
                        <div v-if="loadingFile==true" style="color:blue;">Загружается...</div>
                        <div v-if="loadingFile==false" style="color:green;">Загружен</div>
                    </div>
                </div>

                <div class="d-flex flex-row justify-content-between mb-4">
                    <label for="img">Выберете изображения для полета:</label>
                    <input type="file" name="img" accept="image/*" @change="handleSelected" multiple="" style="width:40%"/>
                </div>
            </div>
            <div class="photos-div-style w-100">
                <div
                    v-for="(image, index) in images"
                    :key="index"
                    class="p-2"
                >
                    <div
                        class="d-flex flex-column justify-content-center align-items-center"
                        style="width: 150px; height: 100px"
                    >
                        <div style="font-size: 15px">{{image.name}}</div>
                        <div style="font-size: 15px">Загрузка: {{ image.currentProgress }}</div>
                    </div>
                </div>
            </div>
            <div
                v-if="images.length!=0"
            >
                Загружено фотографий {{images.length}}/{{countImages}}
            </div>
            <button @click="addButton" class="btn button-style">Сохранить полет</button>
                <!-- <div class="tooltip-style">
                    <input type="checkbox" style="margin-right: 10px;" name="save">
                    <label for="save">С сохранением в фолографий в базу данных</label>
                    <span>При включении данной функции фотограграфии не будут загружены в бд. Будут загружены только те фотографии, на который будут отмечены объекты в течении текущей сессии</span>
                </div> -->
        </div>
    </modal-window>
</template>

<script>
import ModalWindow from '../UI/ModalWindow.vue'
import { mapGetters } from 'vuex'
import { useLoadImagesApi } from './loadImages.js'

export default {
    setup() {
        const loadImagesApi = useLoadImagesApi()
        return {
            ...loadImagesApi
        }
    },
    props:{
        show:{
            type: Boolean,
            default: false
        },
        project_id:{
            type: Number
        },
        loading:{
            type: Boolean
        },
        editFly:{
            type: Object
        }
    },
    components: { 
        ModalWindow,
    },
    data(){

        return{
            cssModal:{
                maxWidth: "80%",
                maxHeight: "90%",
            },
            errors: null,
            imagesCoordsData: {},
            file: null,
            loadingFile: null,
            
            flyParams:{
                flyDate: null,
                flyName: null,
                robot: null,
                camera: null,
                commentary: null,
            }
        }
    },
    methods:{
        dialogHidden() {
            this.$emit("update:show", false)
            this.images=[]
            this.imagesCoordsData={}
            this.loadingFile = null
        },
        uploadTxtFile(e){
            this.loadingFile = false
            this.imagesCoordsData={}
            if(e.target.files[0]){
                this.file = e.target.files[0]
                const reader = new FileReader();                
                reader.onload=()=>{
                    let targetText = reader.result.split('\r\n');
                    targetText.forEach(line => {
                        if(line.length>0){
                            let splitLine = line.split('\t')
                            this.imagesCoordsData[splitLine[0]]=[splitLine[1], splitLine[2]]
                        }
                    });
                }
                reader.readAsText(e.target.files[0])
                this.errors = null
            }
        },
        addButton(){
            if(!this.flyParams.flyName){
                this.errors="Трубуется название полета"
                return
            }
            if(!this.flyParams.flyDate){
                this.errors="Трубуется дата полета"
                return
            }
            if(this.invalidImages.length!=0){
                this.errors="Требуются координаты для выбранных фотографий"
                return
            }
            this.errors = null

            const headers =  {
                headers: {'Authorization': 'Bearer ' + this.STATE.token.token},
                'Content-Type': 'multipart/form-data'
            }

            var formData = new FormData();
            var flyData = {
                name: this.flyParams.flyName,
                date: this.flyParams.flyDate,
                project: this.project_id
            }
            if(!this.editFly){
                flyData.coords = this.imagesCoordsData
            }
            else{
                this.imagesCoordsData = this.editFly.images_coords
            }

            if(this.flyParams.robot){
                flyData.robot = this.flyParams.robot
            }
            if(this.flyParams.camera){
                flyData.camera = this.flyParams.camera
            }
            if(this.flyParams.commentary){
                flyData.commentary = this.flyParams.commentary
            }
            this.$emit('update:loading', true)
            this.images.forEach((image)=>{
                formData.append(this.imagesCoordsData[image.name][0]+';'+this.imagesCoordsData[image.name][1], this.dataURLtoFile(image.fileUrl.src, image.name))
            })
            if(!this.editFly){
                formData.append('fly', JSON.stringify(flyData))
                this.$http.post('api/fly/create', formData, headers).then((response)=>{
                    if(response.status==201){
                        alert('Полет успешно сохранен в базу данных')
                    }
                }).catch((error)=>{
                    console.log(error)
                }).finally(()=>{
                    this.$emit('update:loading', false)
                })
            }
            else{
                flyData.fly = this.editFly.id
                formData.append('fly', JSON.stringify(flyData))
                this.$http.put('api/fly/create', formData, headers).then((response)=>{
                    if(response.status==201){
                        this.$emit('update:loading', false)
                        alert('Полет успешно обновлен в базе данных')
                    }
                }).catch((error)=>{
                    console.log(error)
                }).finally(()=>{
                    this.$emit('update:loading', false)
                })
            }
        },
        dataURLtoFile(dataurl, filename) {
 
            var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), 
                n = bstr.length, 
                u8arr = new Uint8Array(n);
                
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            
            return new File([u8arr], filename, {type:mime});
        },
        beforeinput(){
            this.loadingFile = true
        }
    },
    computed:{
        ...mapGetters('account',['STATE']),
        invalidImages(){
            let result = []
            if(this.images.length==0 || Object.keys(this.imagesCoordsData).length==0){
                return result
            }
            this.images.forEach((image)=>{
                if(this.imagesCoordsData[image.name]==undefined){
                    result.push(image.name)
                }
            })
            return result
        }
    },
    watch:{
        editFly(new_v){
            if(new_v){
                this.flyParams = {
                    flyDate: new Date(new_v.at_fly),
                    flyName: new_v.name,
                    robot: new_v.robot_type,
                    camera: new_v.camera_type,
                    commentary: new_v.commentary,       
                }
            }
            else{
                this.flyParams= {
                    flyDate: null,
                    flyName: null,
                    robot: null,
                    camera: null,
                    commentary: null,
                }
            }
        }
    }
}
</script>

<style scoped>
.input-style{
    background: rgba(128, 128, 128, 0);
    border: 1px solid gray;
    border-radius: 5px;
    padding: 5px;
    min-width: 200px;
    width: 70%;
}
.button-style{
    border: 1px solid gray;
    border-radius: 5px;
    margin: 0 20px;
    color: white;
    margin-bottom: 20px;
    margin-top: 10px;
}
.button-style:hover{
    background: rgba(128, 128, 128, 0.771);
}
.content-style{
    overflow-y: hidden
}
.photos-div-style{
    max-height: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    overflow-y: scroll;
}
.error-image{
    box-shadow: 0px 0px 15px 5px red;
}

.tooltip-style span {
	display			: none; 
	padding			: 2px 3px; 
	margin-left		: 8px; 
	width			: 330px;
}
.tooltip-style:hover span {
	display			: inline; 
	position		: absolute; 
	background		: rgb(70, 70, 70); 
	border			: 1px solid #cccccc; 
    border-radius   : 3px;
	color			: #fffefe;
    font-size: 12px;
}
.reqired-field-style{
    color: gray;
}
</style>