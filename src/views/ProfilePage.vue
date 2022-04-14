<template>
    <div class="container-fluid bg-dark  py-5 min-vh-100 row d-flex justify-content-center align-items-center m-0">
        <div class="col-10 col-md-6 col-lg-5 col-xl-4 bg-light d-flex justify-content-center rounded">          
            <div class="align-items-center d-flex flex-column mt-5 mb-3 col-8 col-md-9">
                <BootstrapIcon
                    icon="person-circle"
                    variant="dark"
                    style="font-size: 13rem;"
                    />
                <div class="text-dark fs-2 mb-2">
                    <strong>Имя Фамилия</strong>
                </div>
                <div class="d-flex justify-content-between w-100 mb-3 fs-4">
                    <div class="d-flex align-items-center">
                        <BootstrapIcon
                        icon="at"
                        size="2x"
                        variant="dark"
                        class="margin-right"
                        />
                        <div>email</div>
                    </div>
                    <div class="d-flex align-items-center">
                        <div><BootstrapIcon
                                icon="send"
                                size="2x"
                                variant="dark"
                                class="margin-right"
                                /></div>
                        <div>Telegramm</div>
                    </div>
                </div>
                <div class="w-100 d-flex flex-column mb-5 text-muted px-3">
                    <div class="w-100 d-flex justify-content-between mb-1">
                        <div>
                            Загружено полетов
                        </div>
                        <div>
                            1
                        </div>
                    </div>
                    <div class="w-100 d-flex justify-content-between">
                        <div>
                            Найдено объектов
                        </div>
                        <div>
                            20
                        </div>
                    </div>
                </div>

                <button class="btn btn-outline-dark btn-md px-5 mb-3" type="submit">Выйти из акккаунта</button>
                <div class=" px-2 rounded mt-4 date "> <span class="join">Регистрация Май, 2021</span> </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

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