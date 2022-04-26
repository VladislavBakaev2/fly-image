<template>
    <div class="d-flex flex-column m-1 main-object-style">
        <div class="align-self-center">{{object.name}}</div>
        <div class="d-flex flex-row">
            <div><img height="110" :src="object.objects[object.objects.length-1].ref_photo"/></div>
            <div class="m-2 content-style">
                <ul class="list-style">
                    <li class="d-flex flex-row justify-content-between"><div>Записей в хронологии&nbsp;&nbsp;&nbsp;&nbsp;</div><div>{{object.objects.length}}</div></li>
                    <li class="d-flex flex-row justify-content-between"><div>Первая запись&nbsp;&nbsp;&nbsp;&nbsp;</div><div>{{object.at_first}}</div></li>
                    <li class="d-flex flex-row justify-content-between"><div>Последняя запись&nbsp;&nbsp;&nbsp;&nbsp;</div><div>{{object.at_last}}</div></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        object:{
            type: Object
        }
    }
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