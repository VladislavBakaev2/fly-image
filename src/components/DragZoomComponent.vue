<template>
    <div class="content-style"
        @mousedown="$event.which==1?mouseDownDrag($event):''"
        @mouseup="$event.which==1?mouseUpDrag($event):''"
        @mousemove="mouseMoveDrag"
        @mousewheel="mouseWheelDrag"  
    >
        <div 
            :style="{transform: `translate(${convertToPx[0]},${convertToPx[1]}) scale(${Math.exp(drag_params.wheel)})`}"
        >
            <canvas id="canvas"
                @mousedown="($event.which==3&&STATE.user)?mouseDownDraw($event):''" 
                @mouseup="($event.which==3&&STATE.user)?mouseUpDraw($event):''" 
                @mousemove="mouseMoveDraw"
                @contextmenu.prevent          
            ></canvas>
        </div>
    </div>
    <slot></slot>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    props:{
        img:{
            type: String
        },
        start_rect:{
            type: Object
        },
        drawn_rectangle:{
            type: Object
        }
    },
    data(){
        return {  
            drag_params: {
                isDrag: false,
                translate: [0,0],
                div_translate: [0,0],
                startPoint: null,
                wheel: 0.0
            },
            draw_params: {
                current: {
                    x: 0,
                    y: 0
                },
                previous: {
                    x: 0,
                    y: 0
                },
                rect:{
                    startX:0,
                    startY:0,
                    w:0,
                    h:0
                },
                down: false
            },
            canvas_img: null,
        }
    },
    methods:{
        mouseDownDrag(e){
            this.drag_params.scaleTransformOrigin = ['0px', '0px']
            event.preventDefault()
            this.drag_params.startPoint = {x:e.layerX, y:e.layerY}
            this.drag_params.isDrag=true
        },
        mouseUpDrag(){
            this.drag_params.startPoint=null
            this.drag_params.translate[0] +=this.drag_params.div_translate[0]
            this.drag_params.translate[1] +=this.drag_params.div_translate[1]
            this.drag_params.div_translate = [0,0]
            this.drag_params.isDrag=false
        },
        mouseMoveDrag(e){
            if(this.drag_params.isDrag){
                this.drag_params.div_translate[0] = (e.layerX - this.drag_params.startPoint.x)
                this.drag_params.div_translate[1] = (e.layerY - this.drag_params.startPoint.y)
            }
        },
        mouseWheelDrag(e){
            this.drag_params.wheel +=e.wheelDeltaY/1000
        },



        drawRecrangle: function () {
            var c = document.getElementById("canvas");
            var ctx = c.getContext("2d");
            ctx.drawImage(this.canvas_img,0,0);
            ctx.lineWidth = 6
            ctx.setLineDash([0]);
            ctx.strokeStyle = "red"
            ctx.strokeRect(this.draw_params.rect.startX, this.draw_params.rect.startY, this.draw_params.rect.w, this.draw_params.rect.h);
        },
        mouseDownDraw: function (event) {
            event.preventDefault()
            this.draw_params.down = true;
            this.draw_params.current = {
                x: event.offsetX,
                y: event.offsetY
            }
            this.draw_params.rect.startX = this.draw_params.current.x;
            this.draw_params.rect.startY = this.draw_params.current.y;
        },
        mouseUpDraw: function () {
            this.draw_params.down = false;
            this.$emit('update:drawn_rectangle', this.draw_params.rect)
        },
        mouseMoveDraw: function (event) {
            if(this.draw_params.down == true){
                this.draw_params.current = {
                    x: event.offsetX,
                    y: event.offsetY
                }
                if (this.draw_params.down) {
                    this.draw_params.rect.w = this.draw_params.current.x - this.draw_params.rect.startX;
                    this.draw_params.rect.h = this.draw_params.current.y - this.draw_params.rect.startY ;
                    this.drawRecrangle()
                }
            }
        },

        updateCanvas(){
            console.log('new')
            var img = new Image();
            var myCanvas = document.getElementById('canvas');
            var ctx = myCanvas.getContext('2d');
            img.onload = ()=>{
                myCanvas.width = img.width
                myCanvas.height = img.height
                ctx.drawImage(img,0,0); // Or at whatever offset you like
                if(this.start_rect){
                    this.draw_params.rect = {
                        startX: this.start_rect.startX,
                        startY: this.start_rect.startY,
                        w: this.start_rect.w,
                        h: this.start_rect.h
                    }
                    this.drawRecrangle()
                }
            };
            img.src = this.img;
            this.canvas_img=img
        }
    },
    computed:{
        convertToPx(){
            return [this.drag_params.translate[0]+this.drag_params.div_translate[0]+'px',
                    this.drag_params.translate[1]+this.drag_params.div_translate[1]+'px']
        },
        ...mapGetters('account',['STATE']),
    },
    mounted(){
        this.updateCanvas()
    },
    watch:{
        img(){
            this.updateCanvas()
            // this.drag_params.translate = [0,0]
            // this.drag_params.wheel = 0.0
        },
        start_rect(){
            this.updateCanvas()
            // this.drag_params.translate = [0,0]
            // this.drag_params.wheel = 0.0
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
    margin: 20px;
}
</style>