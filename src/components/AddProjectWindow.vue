<template>
    <modal-window
        :show="show"
        @update:show="dialogHidden"
        :modalStyle="cssModal"
    >
    </modal-window>
</template>

<script>
import ModalWindow from './ModalWindow.vue'
export default {
    props:{
        show:{
            type: Boolean,
            default: false
        }
    },
    components: { ModalWindow },
    data(){
        return{
            cssModal:{
                maxWidth: "40%",
                maxHeight: "40%",
            },
            nameProject: ''
        }
    },
    methods:{
        dialogHidden() {
            this.$emit("update:show", false)
        },
    },
}
</script>

<style scoped>
/* .input-style{
    background: rgba(128, 128, 128, 0);
    border: 1px solid gray;
    border-radius: 5px;
} */
</style>