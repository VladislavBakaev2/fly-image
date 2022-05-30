<template>
    <div class="content-style"
        @mousedown="$event.which==1?mouseDownDrag($event):''"
        @mouseup="$event.which==1?mouseUpDrag($event):''"
        @mousemove="mouseMoveDrag"
        @mousewheel="mouseWheelDrag"
        ref="content_div"
    >
        <div 
            :style="{transform: `translate(${convertToPx[0]},${convertToPx[1]}) scale(${drag_params.scale})`}"
            class="image-div-style"
        >
            <canvas id="canvas"
                @mousedown="($event.which==3&&STATE.user)?mouseDownDraw($event):''" 
                @mouseup="($event.which==3&&STATE.user)?mouseUpDraw($event):''" 
                @mousemove="mouseMoveDraw"
                @contextmenu.prevent
                ref="image"
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
                scale: 1.0,
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
            const x = e.layerX
            const y = e.layerY
            let amount;
            if (e.wheelDeltaY>0){
                this.drag_params.scale *= 1.1
                amount = 1.1
            }
            else{
                this.drag_params.scale *=0.9
                amount = 0.9
            }
            this.drag_params.translate[0] = x-(x-this.drag_params.translate[0])*amount
            this.drag_params.translate[1] = y-(y-this.drag_params.translate[1])*amount
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
            var img = new Image();
            var myCanvas = document.getElementById('canvas');
            var ctx = myCanvas.getContext('2d');
            img.onload = ()=>{
                myCanvas.width = img.width
                myCanvas.height = img.height
                ctx.drawImage(img,0,0);
                if(this.start_rect){
                    this.draw_params.rect = {
                        startX: this.start_rect.startX,
                        startY: this.start_rect.startY,
                        w: this.start_rect.w,
                        h: this.start_rect.h
                    }
                    this.drawRecrangle()
                    const point = {
                        x: this.$refs.content_div.offsetWidth/2,
                        y: this.$refs.content_div.offsetHeight/2
                    }
                    this.drag_params.translate[0] = point.x - this.start_rect.startX - this.start_rect.w/2
                    this.drag_params.translate[1] = point.y - this.start_rect.startY - this.start_rect.h/2

                    let scale_w = 1;
                    let scale_h = 1;
                    if(point.x*2 < this.start_rect.w){
                        scale_w = this.start_rect.w/(point.x*2)+0.1
                    }

                    if(point.y*2 < this.start_rect.h){
                        scale_h = this.start_rect.h/(point.y*2)+0.1
                    }
                    const scale = scale_w>scale_h?scale_w:scale_h

                    this.scaleAtPoint(point, 1/scale)

                }
                else{
                    const content = {
                        w: this.$refs.content_div.offsetWidth,
                        h: this.$refs.content_div.offsetHeight
                    }
                    let scale_w = 1;
                    let scale_h = 1;
                    if(content.w*2 < img.width){
                        scale_w = img.width/(content.w)
                    }

                    if(content.h*2 < img.height){
                        scale_h = img.height/(content.h)
                    }
                    const scale = scale_w>scale_h?scale_w:scale_h
                    this.drag_params.scale = 1/scale
                }
            };
            img.src = this.img;
            this.canvas_img=img
        },
        scaleAtPoint(point, scale){
            this.drag_params.translate[0] = point.x-(point.x-this.drag_params.translate[0])*scale
            this.drag_params.translate[1] = point.y-(point.y-this.drag_params.translate[1])*scale
            this.drag_params.scale *=scale
        }
    },
    computed:{
        convertToPx(){
            return [this.translate[0]+'px', this.translate[1]+'px']
        },
        translate(){
            return [
                this.drag_params.translate[0]+this.drag_params.div_translate[0],
                this.drag_params.translate[1]+this.drag_params.div_translate[1]
            ]
        },
        ...mapGetters('account',['STATE']),
        scale(){
            return this.drag_params.scale
        }
    },
    mounted(){
        this.updateCanvas()
    },
    watch:{
        img(){
            this.updateCanvas()
        },
        start_rect(){
            this.updateCanvas()
        }
    }
}
</script>

<style scoped>
.content-style{
    display: inline-block;
    height: 100%;
    overflow: hidden;
    margin: 20px;
}
.image-div-style{
    transform-origin: top left;
    display: flex;
    width: auto;
}
</style>