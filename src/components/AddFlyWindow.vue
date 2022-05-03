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
                    <label for="name">Название полета</label>
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
                    <label for="comment">Комментарий</label>
                    <textarea v-model="flyParams.commentary" rows="2" name="comment" style="width:40%"/>
                </div>

                <div class="d-flex flex-row justify-content-between mb-1">
                    <label for="date">Дата полета</label>
                    <Datepicker v-model="flyParams.flyDate" style="width:40%"></Datepicker>
                </div>
                
                <div class="d-flex flex-row justify-content-between mb-1">
                    <label for="control_file">Файл .txt с указанием координат фотографий:</label>
                    <input @change="uploadTxtFile" type="file" name="control_file" accept=".txt" style="width:40%"/>
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
                    <div v-if="image.fileUrl"
                        class="d-flex flex-column align-items-center"
                    >
                        <img 
                            :src="image.fileUrl" 
                            class="preview" 
                            height="100"
                            :class="{'error-image':invalidImages.includes(image.name)}"
                            />
                        <div style="font-size: 12px">
                            {{image.name}}
                        </div>
                    </div>
                    <div
                        v-else
                        class="d-flex flex-column justify-content-center align-items-center"
                        style="width: 100px; height: 100px"
                    >
                        <div style="font-size: 15px">{{image.name}}</div>
                        <div style="font-size: 15px">Загрузка: {{ image.currentProgress }}</div>
                    </div>
                </div>
            </div>
            <button @click="addButton" class="btn button-style">Создать полет</button>
                <div class="tooltip-style">
                    <input type="checkbox" style="margin-right: 10px" name="save">
                    <label for="save">С сохранением в фолографий в базу данных</label>
                    <span>При включении данной функции фотограграфии не будут загружены в бд. Будут загружены только те фотографии, на который будут отмечены объекты в течении текущей сессии</span>
                </div>
        </div>
    </modal-window>
</template>

<script>
import ModalWindow from './ModalWindow.vue'
import { mapGetters } from 'vuex'
import { ref } from 'vue'


export default {
    setup() {
        let images = ref([])
        let inputData = null
        const front = 2
        let currentStep = 0

        function handleEvent(event, image, reader) {
            if (['loadend', 'load'].includes(event.type)) {
                image.currentProgress = '100%';
                image.fileUrl = reader.result;
                if(images.value.filter(data=>data.fileUrl==null)==0){
                    currentStep+=1
                    setTimeout(loadDataPiece(), 500)
                }
            }
            if (event.type === 'progress') {
                image.currentProgress = `${(event.loaded / image.totalSize).toFixed(2) * 100}%`;
            }
            if (event.type === 'loadstart') {
                image.totalSize = event.total;
            }
        }

        function addListeners(reader, image) {
            reader.addEventListener('loadstart', (e) => handleEvent(e, image, reader)); 
            reader.addEventListener('load', (e) => handleEvent(e, image, reader));
            reader.addEventListener('loadend', (e) => handleEvent(e, image, reader));
            reader.addEventListener('progress', (e) => handleEvent(e, image, reader));
            reader.addEventListener('error', (e) => handleEvent(e, image, reader));
            reader.addEventListener('abort', (e) => handleEvent(e, image, reader));
        }

        function loadDataPiece(){
            let end = inputData.length > currentStep*front + front ? currentStep*front + front : inputData.length
            for(let i=currentStep*front; i<end; i++){
                let selectedFile = inputData[i]
                if (selectedFile) {
                    const reader = new FileReader();
                    images.value.push({
                        fileUrl: null,
                        totalSize: 0,
                        currentProgress: '0%',
                        name: selectedFile.name
                    })
                    addListeners(reader, images.value[images.value.length-1]);
                    reader.readAsDataURL(selectedFile);                
                }
            }
        }

        function handleSelected(e) {
            images.value=[]
            inputData = e.target.files
            currentStep = 0
            loadDataPiece()
        }

        return {
            images,
            handleSelected
        }
    },
    props:{
        show:{
            type: Boolean,
            default: false
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
        },
        uploadTxtFile(e){
            this.imagesCoordsData={}
            if(e.target.files[0]){
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
            this.errors = null
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
	width			: 230px;
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
</style>