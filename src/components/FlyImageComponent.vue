<template>
    <modal-window
        :show="show"
        @update:show="dialogHidden"
    >
        text
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
    methods:{
        dialogHidden() {
            this.$emit("update:show", false)
        },
    }
}
</script>

<style scoped>

</style>