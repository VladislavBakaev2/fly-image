<template>
    <div class="d-flex flex-column m-1 main-object-style">
        <div class="align-self-center">{{fly.name}}</div>
        <div class="d-flex flex-column fly-content-style m-2">
            <div class="d-flex justify-content-around">
                <img v-if='fly.photos[0]' height="70" width="90" :src="fly.photos[0].src"/>
                <!-- <img height="70" v-if='fly.photos[1]' width="90" :src="fly.photos[1].src"/> -->
                <!-- <img height="70" v-if='fly.photos[2]' width="90" :src="fly.photos[2].src"/> -->
            </div>
            <div class="d-flex flex-row justify-content-center">
                <ul class="list-style">
                    <li class="d-flex flex-row justify-content-between"><div>Количество фотографий&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>{{fly.photos.length}}</div></li>
                    <li class="d-flex flex-row justify-content-between"><div>Дата полета&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>{{fly.at_fly}}</div></li>
                    <li class="d-flex flex-row justify-content-between"><div>Aвтор&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>{{fly.author}}</div></li>
                    <li class="d-flex flex-row justify-content-between"><div>Тип робота&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>{{fly.robot_type}}</div></li>
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
img {
  object-fit: cover;
}
</style>