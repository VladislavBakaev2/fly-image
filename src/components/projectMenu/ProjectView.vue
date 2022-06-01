<template>
    <div class="d-flex flex-column text-white project-div-style ">
        <div class="fs-5">{{project.name}}</div>
        <div class="row-style d-flex flex-row"><div>Количество полетов:</div><div>{{project.fly_count}}</div></div>
        <div class="row-style d-flex flex-row"><div>Количество объектов:</div><div>{{project.object_count}}</div></div>
        <div class="row-style d-flex flex-row"><div>Автор:</div><div>{{project.author}}</div></div>
        <div class="row-style d-flex flex-row"><div>Дата создания:</div><div>{{project.at_create}}</div></div>
        <div class="row-style d-flex flex-row"><div>Дата обновления:</div><div>{{project.at_update}}</div></div>
        <button v-if="$store.state.account.status.loggedIn" type="button" class="btn button-style text-white align-self-center" @click.stop="$emit('deleteEvent')">
            Удалить проект
        </button>
    </div>
</template>

<script>
export default {
    props:{
        project:{
            type: Object,
            requred: true
        }
    },
    methods:{
    }

}
</script>

<style scoped>
.row-style{
    justify-content: space-between;
    margin: 0 5px;
}
.project-div-style{
    margin: 5px 10px;
    padding: 0px 10px;
    font-size: 14px;
    border-bottom: 2px solid gray;
    transition: background-color 0.3s linear;
    border-radius: 5px 5px 0 0;
}
.project-div-style:hover{
    background-color: rgba(87, 87, 87, 0.831);
    box-shadow: 0 8px 17px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
}
.button-style{
    font-size: 14px;
    border: 1px solid gray;
    border-radius: 5px;
    margin: 5px 20px;
    width: 150px;
}
.button-style:hover{
    background: rgba(128, 128, 128, 0.771);
}
</style>