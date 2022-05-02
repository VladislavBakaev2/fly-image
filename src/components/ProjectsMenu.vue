<template>
    <off-canvas-body
        :target_id="canvas_props.target_canvas_id"
        :height_offset="canvas_props.header_height"
    >
        <div class="search-div-style">
            <input type="text"
                   :value="modelValue"
                   @input="changeSearchValue"
                   class="form-control search-input-style text-white"
                   placeholder="Поиск">
        </div>
        <button v-if="$store.state.account.status.loggedIn" type="button" class="btn button-style" @click="addEvent">
            <BootstrapIcon
                icon="plus-lg"
                size="2x"
                variant="light"
                />
        </button>
        <div v-if="projects.length !=0">
            <project-view
                v-for="project in projects"
                :key="project.id"
                :project="project"
                @click="projectClick(project.id)"
            />
        </div>
        <div class="text-white text-center fs-4 nothing-style" v-else>
            Ничего не найдено
        </div>

    </off-canvas-body> 
</template>

<script>
import OffCanvasBody from '@/components/OffCanvasBody.vue'
import ProjectView from './ProjectView.vue'

export default {
    components:{
        OffCanvasBody,
        ProjectView
    },
    props:{
        canvas_props:{
            type: Object,
            reqiured: true
        },
        projects:{
            type: Object,
            reqiured: true
        },
        modelValue:{
            type: String
        }
    },
    methods: {
        changeSearchValue: function(event){
            this.$emit('update:modelValue', event.target.value)
        },
        projectClick(target_id){
            this.$emit('targetUpdate', target_id)
        },
        addEvent(){
            this.$emit('addEvent')
        }
    }
}
</script>

<style scoped>
.search-div-style{
    margin: 5px;
}
.search-input-style{
    background-color: rgba(0, 0, 0, 0.074);
}
.search-input-style::placeholder{
    color: rgba(255, 255, 255, 0.535);
}
.search-input-style:focus{
    box-shadow: 0 0 1px #ebebeb;
    border:1px solid rgb(255, 255, 255);
    background-color: rgba(0, 0, 0, 0.074);
}
.nothing-style{
    margin-top: 30px ;
}
.button-style{
    border: 1px solid gray;
    border-radius: 5px;
    margin: 0 20px;
}
.button-style:hover{
    background: rgba(128, 128, 128, 0.771);
}
</style>