<template>
    <modal-window
        :show="show"
        @update:show="dialogHidden"
        :modalStyle="cssModal"
    >
        <Form @submit="createProject" class="d-flex flex-column text-light  align-items-center" :validation-schema="schema">
            <label for="nameInput" class="fs-5 mt-3">Название нового проекта</label>
            <Field type="text" id="nameInput" placeholder="Введите название проекта" class="input-style m-3 text-light" name="name" v-model="nameProject"/>
            <ErrorMessage name="name" class="error-feedback text-danger" />
            <div v-if="errorMessage" class="error-feedback text-danger">{{errorMessage}}</div>
            <button type="submit" class="btn button-style">Создать проект</button>
        </Form>
    </modal-window>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import ModalWindow from './UI/ModalWindow.vue'
import { mapGetters } from 'vuex'


export default {
    props:{
        show:{
            type: Boolean,
            default: false
        }
    },
    components: { 
        ModalWindow,
        Field,
        ErrorMessage,
        Form
    },
    data(){
        const schema = yup.object().shape({
        name: yup
            .string()
            .required("Требуется название!")
        });
        return{
            cssModal:{
                maxWidth: "40%",
                maxHeight: "40%",
            },
            nameProject: '',
            errorMessage: null,
            schema
        }
    },
    methods:{
        dialogHidden() {
            this.$emit("update:show", false)
        },
        createProject(){
            const headers =  {
                headers: {'Authorization': 'Bearer ' + this.STATE.token.token}
            }
            this.$http.post('/api/project/create', {'name':this.nameProject},headers).then((response)=>{
                if(response.status==201){
                    this.errorMessage=null
                    this.dialogHidden()
                    alert(`Проект с именем "${this.nameProject}" создан`)
                    this.$emit('updateProjects')
                }
            }).catch((error)=>{
                // if(error.response)
                if(error.response.data.errors){
                    error.response.data.errors.forEach((error)=>{
                        if(error.indexOf('уникальным')!=-1){
                            this.errorMessage='Проект с указанным именем уже существует'
                            return
                        }
                    })
                }
                else{
                    this.errorMessage="Неизвестная ошибка. Не удалось создать проект"
                }
            })
        }
    },
    computed:{
        ...mapGetters('account',['STATE']),
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
</style>