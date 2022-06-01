<template>
    <div class="toggle-button">
        <BootstrapIcon
            class="button-icon"
            icon="list"
            size="2x"
            variant="light"
            data-bs-toggle="offcanvas"
            :id="target_id+'_button'"
            :data-bs-target="target_id"/>
    </div>
</template>

<script>
export default {
    props:{
        target_id: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped>
.toggle-button{
    height: 35px;
    width: 35px;
    border-radius: 50%;
    transition: background-color 0.5s linear;
}
.button-icon{
    height: 100%;
    width: 100%;
}
.toggle-button:hover{
    background-color: gray;
}
</style>