<template>
    <router-view v-slot="{ Component }">
        <keep-alive>
            <component :is="Component" :key="$route.fullPath"></component>
        </keep-alive>
    </router-view>
</template>

<style>
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.all-window-height{
    height: 100vh;
}
.enable-icon{
    cursor: pointer;
}
</style>
