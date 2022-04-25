<template>
    <div 
        class="offcanvas offcanvas-start offcanvas-style"
        :id="target_id"
        :style="{marginTop:height_offset}">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props:{
        target_id:{
            type: String,
            required: true
        },
        height_offset:{
            type: String,
            required: true
        }
    }
}
</script>

<style scoped>
.offcanvas-style{
    width: 350px;
    background: #3f3f3fca;
    border-right: 1px solid white;
    overflow-y: scroll;
}
</style>