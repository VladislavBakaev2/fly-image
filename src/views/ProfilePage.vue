<template>
    <div class="container-fluid bg-dark  py-5 min-vh-100 row d-flex justify-content-center align-items-center m-0">
        <div class="col-10 col-md-6 col-lg-5 col-xl-4 bg-light d-flex justify-content-center rounded">          
            <div v-if="userIs" class="align-items-center d-flex flex-column mt-5 mb-3 col-8 col-md-9">
                <div class="house-style enable-icon">
                    <BootstrapIcon
                        icon="house"
                        size="5x"
                        variant="dark"
                        @click="$router.push('/')"
                        />       
                </div>
                <BootstrapIcon
                    icon="person-circle"
                    variant="dark"
                    style="font-size: 13rem;"
                    />
                <div class="text-dark fs-2 mb-2">
                    <strong>{{STATE.user.first_name + ' ' + STATE.user.last_name}}</strong>
                </div>
                <div class="d-flex flex-column w-100 mb-3 fs-4">
                    <div class="d-flex align-items-center">
                        <BootstrapIcon
                        icon="at"
                        size="2x"
                        variant="dark"
                        class="margin-right"
                        />
                        <div>{{STATE.user.email}}</div>
                    </div>
                    <div class="d-flex align-items-center"
                        v-if="STATE.user.telegramm!=''"
                    >
                        <div><BootstrapIcon
                                icon="send"
                                size="2x"
                                variant="dark"
                                class="margin-right"
                                /></div>
                        <div>{{STATE.user.telegramm}}</div>
                    </div>
                </div>
                <div class="w-100 d-flex flex-column mb-5 text-muted px-3">
                    <div class="w-100 d-flex justify-content-between mb-1">
                        <div>
                            Загружено полетов
                        </div>
                        <div>
                            {{STATE.user.fly_count}}
                        </div>
                    </div>
                    <div class="w-100 d-flex justify-content-between">
                        <div>
                            Найдено объектов
                        </div>
                        <div>
                            {{STATE.user.object_count}}
                        </div>
                    </div>
                </div>

                <button class="btn btn-outline-dark btn-md px-5 mb-3" @click="logout">Выйти из акккаунта</button>
                <div class=" px-2 rounded mt-4 date "> <span class="join">Регистрация {{registerData}}</span> </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    methods:{
        logout(){
            this.logout()
        },
        ...mapActions('account',['logout'])
    },
    computed:{
        ...mapGetters('account',['STATE']),
        ...mapGetters('alert',['STATE_ALERT']),
        registerData(){
            const date = new Date(this.STATE.user.at_create)
            const month = date.toLocaleString('default', { month: 'long' });
            return month+', '+date.getFullYear()
        }
    }
}
</script>

<style scoped>
.join {
    font-size: 14px;
    color: #737373;
    font-weight: bold
}

.date {
    background-color: #ccc
}
.margin-right{
    margin-right: 0.5rem;
}
</style>