<template>
    <div class="container-fluid bg-dark  py-5 min-vh-100 row d-flex justify-content-center align-items-center m-0">
        <Form @submit="handleSignIn" :validation-schema="schema" class="col-12 col-md-8 col-lg-6 col-xl-4">
            <div class="text-white" style="border-radius: 1rem;">
                <div class="p-5 text-center">
                    <div class="house-style enable-icon">
                        <BootstrapIcon
                            icon="house"
                            size="5x"
                            variant="light"
                            @click="$router.push('/')"
                            />       
                    </div>
                    <div class="mb-md-5 mt-md-4 pb-5">

                        <h2 class="fw-bold mb-2 text-uppercase">Авторизация</h2>
                        <p class="text-white-50 mb-5">Введите email и пароль вашего акккаунта</p>

                        <div class="form-outline form-white mb-4">
                            <Field name="email" id="typeEmailX" type="email" class="form-control form-control-lg"/>
                            <label class="form-label" for="typeEmailX">Email</label><br>
                            <ErrorMessage name="email" class="error-feedback text-danger" />
                        </div>

                        <div class="form-outline form-white mb-4">
                            <Field name="password" id="typePasswordX" type="password" class="form-control form-control-lg" />
                            <label class="form-label" for="typePasswordX">Пароль</label><br>
                            <ErrorMessage name="password" class="error-feedback text-danger" />
                        </div>

                        <button class="btn btn-outline-light btn-lg px-5 mb-3" type="submit">Войти</button>
                        <div v-if="STATE.status.logginError" class="error-feedback text-danger">
                            Пользователь с указанными email и паролем не найдены
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { mapActions, mapGetters } from 'vuex'

export default {
    components:{
        Form,
        Field,
        ErrorMessage,
    },
    data(){
        const schema = yup.object().shape({
        email: yup
            .string()
            .required("Требуется Email!")
            .email("Неверный Email!"),
        password: yup
            .string()
            .required("Требуется пароль!")
            .min(6, "Минимум 6 символов!")
            .max(40, "Максимум 40 символов!"),
        });
        return{
            schema
        }
    },
    methods:{
        handleSignIn(user){
            this.login(user)
        },
        ...mapActions('account',['login'])
    },
    computed:{
        ...mapGetters('account',['STATE']),
        ...mapGetters('alert',['STATE_ALERT']),
    },

}
</script>

<style scoped>
</style>