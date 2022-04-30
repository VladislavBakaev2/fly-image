<template>
    <div class="container-fluid bg-dark min-vh-100 row d-flex justify-content-center align-items-center m-0">
        <Form @submit="handleSignIn" :validation-schema="schema" class="col-12 col-md-8 col-lg-6 col-xl-4 text-white text-center">
                    <div class="house-style enable-icon">
                        <BootstrapIcon
                            icon="house"
                            size="5x"
                            variant="light"
                            @click="$router.push('/')"
                            />       
                    </div>
                    <div class="mb-md-5 mt-md-4">

                        <h2 class="fw-bold mb-2 text-uppercase">Регистрация</h2>
                        <p class="text-white-50 mb-5">Заполните необходимые поля (помечены символом *)</p>

                        <div class="form-outline form-white mb-4">
                            <Field name="first_name" id="first_name" type="text" class="form-control form-control-lg" />
                            <label class="form-label" for="first_name">Имя*</label><br>
                            <ErrorMessage name="first_name" class="error-feedback text-danger" />
                        </div>

                        <div class="form-outline form-white mb-4">
                            <Field name="last_name" id="last-name" type="text" class="form-control form-control-lg" />
                            <label class="form-label" for="last-name">Фамилия*</label><br>
                            <ErrorMessage name="last_name" class="error-feedback text-danger" />
                        </div>

                        <div class="form-outline form-white mb-4">
                            <Field name="email" id="typeEmailX" type="email" class="form-control form-control-lg" />
                            <label class="form-label" for="typeEmailX">Email*</label><br>
                            <ErrorMessage name="email" class="error-feedback text-danger" />
                        </div>

                        <div class="form-outline form-white mb-4">
                            <Field name="telegramm" id="telegramm" type="text" class="form-control form-control-lg" />
                            <label class="form-label" for="telegramm">Telegramm</label><br>
                        </div>
                        <div class="d-flex flex-row justify-content-between mb-4">
                            <div class="form-outline form-white margin-right">
                                <Field name="password" id="typePasswordX" type="password" class="form-control form-control-lg" />
                                <label class="form-label" for="typePasswordX">Пароль*</label><br>
                                <ErrorMessage name="password" class="error-feedback text-danger" />
                            </div>
                            <div class="form-outline form-white margin-left">
                                <Field name="passwordConfirmation" id="typePasswordXC" type="password" class="form-control form-control-lg" />
                                <label class="form-label" for="typePasswordXC">Повторите пароль*</label><br>
                                <ErrorMessage name="passwordConfirmation" class="error-feedback text-danger" />
                            </div>
                        </div>
                        <button class="btn btn-outline-light btn-lg px-5" type="submit">Зарегистрироваться</button>
                        <div v-if="STATE.status.registerError" class="error-feedback text-danger">
                            Пользователь с указанными email уже создан
                        </div>
                        <div v-if="STATE.status.register" class="text-light">
                            Пользователь зарегистрирован
                        </div>
                    </div>
        </Form>
    </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { mapGetters, mapActions } from 'vuex'
import * as yup from "yup";

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
            .max(40, "Максимум 8 символов!"),
        passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Пароли должны совпадать'),
        first_name: yup
            .string()
            .required("Обязательное поле"),
        last_name: yup
            .string()
            .required("Обязательное поле")
        });
        return{
            schema
        }
    },
    computed:{
        ...mapGetters('account',['STATE']),
        ...mapGetters('alert',['STATE_ALERT']),

    },
    methods:{
        handleSignIn(user){
            this.register(user)
        },
        ...mapActions('account',['register'])
    }
}
</script>

<style scoped>
.margin-right{
    margin-right: 1rem;
}
.margin-left{
    margin-left: 1rem;
}
</style>