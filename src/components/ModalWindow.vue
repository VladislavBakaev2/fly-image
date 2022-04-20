<template>
  <div class="modal-window-style" v-if="show" @click="hideDialog">
      <div class='modal-content' :style="cssProps" @click.stop>
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
        width:{
            type: Number
        }
    },
    methods: {
        hideDialog() {
            // this.$emit('update:show', false)
        }
    },
    computed:{
        cssProps(){
            return {'--width': this.width+"%"}
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
}
.modal-content{
    margin: auto;
    background: rgb(255, 255, 255);
    border-radius: 4px;
    width: var(--width);
    padding: 20px;
    display: flex;
    flex-direction: column;
    border: 1px solid rgb(148, 148, 148);
}
</style>