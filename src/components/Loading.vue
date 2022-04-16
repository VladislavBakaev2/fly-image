<template>
    <div  v-if="modelValue"
        class="container-fluid bg-dark bg-opacity-50 min-vh-100 m-0 position-fixed fixed-top blur-class text-light d-flex justify-content-center align-items-center"
    >
        <div class="d-flex flex-column align-items-center">
            <div class="display-6 text-shadow">Загрузка данных</div>
            <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        modelValue:{
            type: Boolean,
            required: true
        }
    }
}
</script>

<style scoped>
.blur-class{
    backdrop-filter: blur(4px);
}
.text-shadow{
    text-shadow: rgb(238, 238, 238) 1px 0 30px;
}
</style>