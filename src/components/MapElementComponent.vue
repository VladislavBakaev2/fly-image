<template>
    <div class="slide-style text-light blur-class">
        <div class="d-flex justify-content-center align-items-center button-style"
            @click="changeState"
        >
            <BootstrapIcon
                v-if="open"
                icon="caret-down-fill"
                size="2x"
                variant="light"
                class="m-0"
                />
            <BootstrapIcon
                v-else
                icon="caret-up-fill"
                size="2x"
                variant="light"
                class="m-0"
                />
        </div>
        <transition name="fadeHeight">
            <div v-if="open" class="content-style">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props:{
        open: {
            type: Boolean,
            default: true
        }
    },
    methods:{
        changeState(){
            this.$emit('update:open', !this.open)
        }
    }
}
</script>

<style scoped>
.slide-style{
    background-color: #3f3f3fba;

}
.button-style{
    background-color: #525252;
    height: 18px;
    border-top: 1px solid rgb(255, 255, 255);
}
.content-style{
    height: 150px;
}

.fadeHeight-enter-active,
.fadeHeight-leave-active {
  transition: all 0.5s;
  max-height: 200px;
}
.fadeHeight-enter-from,
.fadeHeight-leave-to
{
  opacity: 0;
  max-height: 0px;
}
.blur-class{
    backdrop-filter: blur(1px);
}
</style>