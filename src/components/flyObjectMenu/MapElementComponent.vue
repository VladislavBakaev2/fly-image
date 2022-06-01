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
                class="m-1"
                />
            <BootstrapIcon
                v-else
                icon="caret-up-fill"
                size="2x"
                variant="light"
                class="m-1"
                />
        </div>
        <transition name="fadeHeight">
            <div v-if="open" class="content-style d-flex justify-content-between">
                <div class="align-self-center rounded-circle button-style-swipe"
                    @click="clickLeft"
                >
                    <BootstrapIcon
                        v-show="activeButton.left"
                        icon="chevron-compact-left"
                        size="3x"
                        variant="light"
                        class="m-1"
                        />
                </div>
                <div class="justify-self-center d-flex"><slot></slot></div>
                <div class="align-self-center rounded-circle button-style-swipe"
                    @click="clickRight"
                >                    
                    <BootstrapIcon
                        v-show="activeButton.right"
                        icon="chevron-compact-right"
                        size="3x"
                        variant="light"
                        class="m-1"
                        />
                </div>
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
        },
        activeButton: {
            type: Object
        }
    },
    methods:{
        changeState(){
            this.$emit('update:open', !this.open)
        },
        clickLeft(){
            this.$emit('clickLeft')
        },
        clickRight(){
            this.$emit('clickRight')
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
    height: 25px;
    border-top: 1px solid rgb(255, 255, 255);
}
.content-style{
    height: 180px;
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
.button-style-swipe{
    margin-left: 0.2rem;
    margin-right: 0.2rem;
}
.button-style-swipe:hover{
    cursor: pointer;
    background: #525252;
}
</style>