<template>
    <div class="content-style"
        @mousedown="mouseDown"
        @mouseup="mouseUp"
        @mousemove="mouseMove"
        @mousewheel="mouseWheel"    
    >
        <div 
            :style="{transform: `translate(${convertToPx[0]},${convertToPx[1]}) scale(${scale})`}"
        >
            <img :src="img">
        </div>
    </div>
    <slot></slot>
</template>

<script>
export default {
    props:{
        img:{
            type: String
        }
    },
    data(){
        return {
            isDrag: false,
            translate: [0,0],
            div_translate: [0,0],
            startPoint: null,
            scale: 1
        }
    },
    methods:{
        mouseDown(e){
            event.preventDefault()
            this.startPoint = {x:e.layerX, y:e.layerY}
            this.isDrag=true
        },
        mouseUp(){
            this.startPoint=null
            this.translate[0] +=this.div_translate[0]
            this.translate[1] +=this.div_translate[1]
            this.div_translate = [0,0]
            this.isDrag=false
        },
        mouseMove(e){
            if(this.isDrag){
                this.div_translate[0] = (e.layerX - this.startPoint.x)
                this.div_translate[1] = (e.layerY - this.startPoint.y)
            }
        },
        mouseWheel(e){
            this.scale +=e.wheelDeltaY/1000
        }
    },
    computed:{
        convertToPx(){
            return [this.translate[0]+this.div_translate[0]+'px',
                    this.translate[1]+this.div_translate[1]+'px']
        }
    }
}
</script>

<style scoped>
.content-style{
    display: inline-block;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>