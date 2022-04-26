<template>
  <div class="modal-window-style" v-if="show" @click="hideDialog">
      <div class='modal-content' :style="modalStyle" @click.stop>
          <slot></slot>
      </div>
  </div>
</template>

<script>
export default {
    props: {
        show:{
            type: Boolean,
            default: false
        },
        modalStyle:{
            type: Object
        }
    },
    methods: {
        hideDialog() {
            // this.$emit('update:show', false)
        }
    }
}
</script>

<style scoped>
.modal-window-style{
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    display: flex;
    backdrop-filter: blur(1px);
    z-index: 2000;
}
.modal-content{
    margin: auto;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    border: 1px solid rgb(255, 255, 255);
    background: -webkit-linear-gradient(0deg, rgb(43, 43, 43) 27%, rgb(95, 95, 95));
    background: -moz-linear-gradient(0deg, rgb(43, 43, 43) 27%, rgb(95, 95, 95));
    background: linear-gradient(0deg, rgb(43, 43, 43) 27%, rgb(95, 95, 95));
}
</style>