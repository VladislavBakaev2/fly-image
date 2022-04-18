<template>
    <div class="d-flex flex-column m-1 main-object-style">
        <div class="align-self-center">Объект</div>
        <div class="d-flex flex-row">
            <div><img height="110" src="https://bipbap.ru/wp-content/uploads/2017/04/0_7c779_5df17311_orig.jpg"/></div>
            <div class="m-2 content-style">
                <ul class="list-style">
                    <li class="d-flex flex-row justify-content-between"><div>Записей в хронологии&nbsp;&nbsp;&nbsp;&nbsp;</div><div>1</div></li>
                    <li class="d-flex flex-row justify-content-between"><div>Первая запись&nbsp;&nbsp;&nbsp;&nbsp;</div><div>10-08-2000</div></li>
                    <li class="d-flex flex-row justify-content-between"><div>Последняя запись&nbsp;&nbsp;&nbsp;&nbsp;</div><div>11-10-2001</div></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.list-style{
   list-style: none;
   padding: 0;
   font-size: 0.7rem;
}
.content-style{
    width: 170px;
}
.main-object-style{
    border-right: 3px solid gray;
}
</style>