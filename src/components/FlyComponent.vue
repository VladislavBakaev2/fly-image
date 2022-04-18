<template>
    <div class="d-flex flex-column m-1 main-object-style">
        <div class="align-self-center">{{fly.name}}</div>
        <div class="d-flex flex-column fly-content-style m-2">
            <div class="d-flex justify-content-between">
                <img height="70" width="90" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr5E4o_wHB9RJuxBZjX8mjr4HFqGo7CHEqvA&usqp=CAU"/>
                <img height="70" width="90" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr5E4o_wHB9RJuxBZjX8mjr4HFqGo7CHEqvA&usqp=CAU"/>
                <img height="70" width="90" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr5E4o_wHB9RJuxBZjX8mjr4HFqGo7CHEqvA&usqp=CAU"/>
            </div>
            <div class="d-flex flex-row justify-content-center">
                <ul class="list-style">
                    <li class="d-flex flex-row justify-content-between"><div>Количество фотографий&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>{{fly.count}}</div></li>
                    <li class="d-flex flex-row justify-content-between"><div>Дата полета&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>{{fly.at_fly}}</div></li>
                    <li class="d-flex flex-row justify-content-between"><div>Дата загрузки&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>{{fly.at_load}}</div></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        fly:{
            type: Object
        }
    }
}
</script>

<style scoped>
img{
    object-fit: cover;
}
.list-style{
   list-style: none;
   padding: 0;
   font-size: 0.8rem;
}
.main-object-style{
    border-right: 3px solid gray;
}
.fly-content-style{
    width: 300px;
}
</style>