<template>
    <modal-window
        :show="show"
        @update:show="dialogHidden"
        :modalStyle="cssModal"
    >
        <Form @submit="deleteProject" class="d-flex flex-column text-light  align-items-center" :validation-schema="schema">
            <label for="nameInput" class="fs-5 mt-3">Удаление проекта: {{project.name}}</label>
            <Field type="text" id="nameInput" placeholder="Введите название проекта для подтверждения удаления" class="input-style m-3 text-light" name="name" v-model="nameProject"/>
            <ErrorMessage name="name" class="error-feedback text-danger" />
            <div v-if="errorMessage" class="error-feedback text-danger">{{errorMessage}}</div>
            <button type="submit" class="btn button-style">Удалить проект</button>
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
        },
        project:{
            type: Object,
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
            .test(
                'name-check',
                'Неверно указано имя проекта',
                name => this.project.name == name
            )
            .required("Требуется название!")
        });
        return{
            cssModal:{
                maxWidth: "70%",
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
        deleteProject(){
            const headers =  {
                headers: {'Authorization': 'Bearer ' + this.STATE.token.token},
                data: {id: this.project.id}
            }
            this.$http.delete('/api/project/delete', headers).then((response)=>{
                if(response.status==200){
                    this.dialogHidden()
                    this.$emit('updateProjects')
                    alert(`Проект ${this.project.name} удален`)
                }
            }).catch((error)=>{
                if (error.response.status == 400 && error.response.data.error=="forbiden"){
                    alert('Недостаточно прав для удаления выбранного проекта')
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