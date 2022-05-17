<template>
    <div class="header-style d-flex flex-row" :style="{height:sideMenuProps.header_height}">
        <div class="d-flex flex-row justify-content-between w-100">
            <toggle-button
                class="toggle-button-style enable-icon"
                :target_id="'#'+sideMenuProps.target_canvas_id"
            />
            <div class="d-flex flex-row">
                <div class="account-info enable-icon"
                    @click="$router.push('profile')"
                    v-if="STATE.status.loggedIn"
                >
                    <span v-if="STATE.user" class="account-name text-white">{{STATE.user.username}}</span>
                    <BootstrapIcon
                        icon="person-circle"
                        size="2x"
                        variant="light"
                        />           
                </div>
                <div class="account-login-logout d-flex flex-row"
                    v-if="STATE.status.logout"
                >
                    <BootstrapIcon
                        icon="person-plus-fill"
                        size="2x"
                        variant="light"
                        class="enable-icon"
                        @click="$router.push('signup')"
                        style="margin-right: 15px;"
                        />
                    <BootstrapIcon
                        icon="person-check"
                        size="2x"
                        variant="light"
                        class="enable-icon"
                        @click="$router.push('signin')"
                        />
                </div>
            </div>
        </div>
    </div>
    <div class="mouse-coord-info d-flex flex-row text-light justify-content-between align-items-center">
        <div>lat: {{mouseCoord[0]}}</div>
        <div>lon: {{mouseCoord[1]}}</div>
        <div>alt: {{mouseCoord[2]}}</div>
    </div>
    <div class="all-window-height w-100">
        <yandex-map-component
            v-model:mouseCoord="mouseCoord"
            v-model:zoom="map_parameters.zoom"
            v-model:center="map_parameters.center"
            :flying="flying"
            :objects="objects"
            @deployFlyChange="deployFlyChange"
            @clickImage="clickImage"
            @clickObject="clickObject"
        />
    </div>
    <projects-menu
        :canvas_props="sideMenuProps"
        :projects="searcherProjects"
        @targetUpdate="updateTargetProject"
        @addEvent="addProjectEvent"
        v-model="searchQuery"
    />
    <fly-object-menu
        :objects="objects"
        :flying="flying"
        @deployFlyChange="deployFlyChange"
        @addFlyEvent="addFlyEvent"
        @centerMapOnObject="centerMapOnObject"
        v-if="viewFlyObjectMenu"
    />
    <loading
        v-model="loading"
    />
    <fly-image-component
        v-model:show="flyImageShow"
        :flying="flying"
    />
    <object-image-component
        v-model:show="objectImageShow"
        :object="activeObject"
    />
    <add-project-window
        v-model:show="addProjectShow"
        @updateProjects="fetchProjects"
    />
    <add-fly-window
        v-model:show="addFlyShow"
        v-model:loading="creatingFly"
        :project_id="projects.target_project_id"
    />
</template>

<script>
import YandexMapComponent from '@/components/YandexMapComponent.vue'
import ToggleButton from '@/components/ToggleButton.vue'
import ProjectsMenu from '@/components/ProjectsMenu.vue'
import Loading from '@/components/Loading.vue'
import FlyObjectMenu from '@/components/FlyObjectMenu.vue'
import FlyImageComponent from '../components/FlyImageComponent.vue'
import ObjectImageComponent from '../components/ObjectImageComponent.vue'

import { ref, getCurrentInstance, computed } from 'vue'
import { mapGetters } from 'vuex'
import AddProjectWindow from '../components/AddProjectWindow.vue'
import AddFlyWindow from '../components/AddFlyWindow.vue'

export default {
    setup(){
        const app = getCurrentInstance()
        const http = app.appContext.config.globalProperties.$http

        const projects = ref({
                target_project_id: null,
                all_projects: [
                    // {id: 1, name: "Побережье", fly_count: 2, object_count:10},
                ]
        })
        const searchQuery = ref('')

        const fetchProjects = ()=>{
            http.get('api/project/get')
                .then((response)=>{
                    if(response.statusText=='OK'){
                        projects.value.all_projects = []
                        projects.value.target_project_id = null
                        response.data.forEach((project)=>{
                            let new_project = {}
                            new_project.id = project.id
                            new_project.author = project.author
                            new_project.fly_count = project.fly_count
                            new_project.object_count = project.object_count
                            new_project.name = project.name
                            new_project.at_create = project.at_create.split('T')[0]
                            new_project.at_update = project.at_update.split('T')[0]
                            projects.value.all_projects.push(new_project)
                        })
                    }
                })
                .catch((error)=>{
                    if(error.name=="Error"){
                        alert('Нет соединения с сервером (загрузка проектов)')
                    }
                    else{
                        alert('Ошибка обработки ответа (загрузка проектов)')
                    }
                })
        }
        const searcherProjects =computed(()=>{
            return projects.value.all_projects.filter(project=>project.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
        })

        return {
            projects,
            fetchProjects,
            searcherProjects,
            searchQuery
        }
    },
    components:{
        YandexMapComponent,
        ToggleButton,
        ProjectsMenu,
        Loading,
        FlyObjectMenu,
        FlyImageComponent,
        ObjectImageComponent,
        AddProjectWindow,
        AddFlyWindow,
    },
    data(){
        return {
            sideMenuProps:{
                target_canvas_id: "sideMenu",
                header_height: '50px'
            },
            loadingFly: false,
            loadingObject: false,
            loadingProject: false,
            creatingFly: false,
            flyImageShow: false,
            objectImageShow: false,
            addProjectShow: false,
            addFlyShow: false,
            map_parameters:{
                center: [55.737722, 37.732367],
                zoom: 6,
            },
            objects:[
            ],
            flying:[
            ],
            mouseCoord: [0,0,0]
        }
    },

    computed:{
        viewFlyObjectMenu(){
            return this.projects.target_project_id
        },
        activeObject(){
            return this.objects.find(object=>object.active)
        },
        loading(){
            return this.loadingFly || this.loadingObject || this.loadingProject || this.creatingFly
        },
        ...mapGetters('account',['STATE']),
    },
    methods:{
        updateTargetProject(id){
            this.projects.target_project_id = id
            this.fetchFlying(id)
            this.fetchObjects(id)
            this.closeSideMenu()
        },
        deployFlyChange(cmd){
            let fly = this.flying.find(fly => fly.id === cmd.id);
            fly.deployed = cmd.deployed
            this.map_parameters.center = fly.photos[0].coords
        },
        centerMapOnObject(coords){
            this.map_parameters.center = coords
        },
        clickImage(cmd){
            let target_fly = this.flying.find(fly=>fly.id == cmd.fly_id)
            let target_photo = target_fly.photos.find(photo=>photo.id==cmd.photo_id)
            target_photo.active = true
            this.flyImageShow = true
        },
        clickObject(cmd){
            let target_object = this.objects.find(object=>object.id==cmd.id)
            target_object.active = true
            this.objectImageShow = true
        },
        fetchFlying(project_id){
            this.loadingFly = true
            this.$http.get('api/fly/get', {params: {'project_id': project_id } })
                .then((response)=>{
                    if(response.statusText=='OK'){
                        this.flying = []
                        response.data.forEach((fly)=>{
                            let new_fly = {}
                            new_fly.id = fly.id
                            new_fly.author = fly.author
                            new_fly.name = fly.name
                            new_fly.robot_type = fly.robot_type
                            new_fly.camera_type = fly.camera_type
                            new_fly.at_create = fly.at_create.split('T')[0]
                            new_fly.at_fly = fly.at_fly
                            new_fly.commentary = fly.commentary
                            new_fly.deployed = false
                            new_fly.photos = []
                            fly.photos.forEach((photo)=>{
                                let new_photo = {}
                                new_photo.id = photo.id
                                new_photo.name = photo.name
                                new_photo.active = false
                                new_photo.coords = photo.coordinate
                                new_photo.src=process.env.VUE_APP_ROOT_API+'/media/'+photo.image
                                new_fly.photos.push(new_photo)
                            })
                            this.flying.push(new_fly)
                        })
                    }
                })
                .catch((error)=>{
                    if(error.name=="Error"){
                        alert('Нет соединения с сервером (загрузка полетов)')
                    }
                    else{
                        alert('Ошибка обработки ответа (загрузка полетов)')
                    }
                })
                .finally(()=>{
                    this.loadingFly = false
                })
        },
        fetchObjects(project_id){
            this.loadingObject = true
            this.$http.get('api/object/get', {params: {'project_id': project_id } })
                .then((response)=>{
                    if(response.statusText=='OK'){
                        this.objects=[]
                        response.data.forEach((object)=>{
                            let new_object = {}
                            new_object.id = object.id
                            new_object.name = object.name
                            new_object.active = false
                            new_object.at_first = object.at_create.split('T')[0]
                            new_object.at_last = object.at_update.split('T')[0]
                            new_object.commentary = object.commentary
                            new_object.coords = object.coordinate
                            new_object.objects = []
                            object.objects.forEach((rec_obj)=>{
                                let new_rec_obj = {}
                                new_rec_obj.id = rec_obj.id
                                new_rec_obj.author = rec_obj.author
                                new_rec_obj.at_create = rec_obj.at_create.split('T')[0]
                                new_rec_obj.ref_photo = process.env.VUE_APP_ROOT_API+'/media/'+rec_obj.image
                                new_rec_obj.commentary = rec_obj.commentary
                                new_rec_obj.rect = rec_obj.image_box
                                new_object.objects.push(new_rec_obj)
                            })
                            this.objects.push(new_object)
                        })
                    }
                })
                .catch((error)=>{
                    if(error.name=="Error"){
                        alert('Нет соединения с сервером (загрузка объектов)')
                    }
                    else{
                        console.error(error)
                        alert('Ошибка обработки ответа (загрузка объектов)')
                    }
                })
                .finally(()=>{
                    this.loadingObject = false
                })
        },
        centeringMap(){
            let max_min_lat = [0,0]
            let max_min_lon = [0,0]
            if (this.objects.length!=0){
                max_min_lat[0] = this.objects[0].coords[0]
                max_min_lat[1] = this.objects[0].coords[0]

                max_min_lon[0] = this.objects[0].coords[1]
                max_min_lon[1] = this.objects[0].coords[1]
            }
            else if(this.flying.length!=0){
                max_min_lat[0] = this.flying[0].photos[0].coords[0]
                max_min_lat[1] = this.flying[0].photos[0].coords[0]

                max_min_lon[0] = this.flying[0].photos[0].coords[1]
                max_min_lon[1] = this.flying[0].photos[0].coords[1]                
            }
            else{
                return
            }
            this.objects.forEach((object)=>{
                if (object.coords[0]>max_min_lat[0]){
                    max_min_lat[0]=object.coords[0]
                }
                else if(object.coords[0]<max_min_lat[1]){
                    max_min_lat[1] = object.coords[0]
                }
                
                if (object.coords[1]>max_min_lon[0]){
                    max_min_lon[0] = object.coords[1]
                }
                else if(object.coords[1]<max_min_lon[1]){
                    max_min_lon[1] = object.coords[1]
                }
            })
            this.flying.forEach((fly)=>{
                fly.photos.forEach((photo)=>{
                    if (photo.coords[0]>max_min_lat[0]){
                        max_min_lat[0]=photo.coords[0]
                    }
                    else if(photo.coords[0]<max_min_lat[1]){
                        max_min_lat[1] = photo.coords[0]
                    }
                    
                    if (photo.coords[1]>max_min_lon[0]){
                        max_min_lon[0] = photo.coords[1]
                    }
                    else if(photo.coords[1]<max_min_lon[1]){
                        max_min_lon[1] = photo.coords[1]
                    }
                })
            })
            this.map_parameters.center = [(max_min_lat[0]+max_min_lat[1])/2, (max_min_lon[0]+max_min_lon[1])/2]
        },
        addProjectEvent(){
            this.addProjectShow = true
            this.closeSideMenu()
        },
        closeSideMenu(){
            var link = document.getElementById('#'+this.sideMenuProps.target_canvas_id+'_button');
            var event = new CustomEvent("click")
            link.dispatchEvent(event)
        },
        addFlyEvent(){
            this.addFlyShow = true
        }
    },
    watch:{
        flyImageShow(new_v){
            if(!new_v){
                this.flying.forEach(fly => {
                    fly.photos.forEach(photo => {
                        photo.active=false
                    })
                });
            }
        },
        objectImageShow(new_v){
            if(!new_v){
                this.objects.forEach(object => {
                    object.active = false
                });
            }
        },
        loading(new_v){
            if(!new_v){
                this.centeringMap()
            }
        }
    },
    mounted(){
        this.fetchProjects()
    }
}
</script>

<style scoped>
.header-style{
    width: 100%;
    background: #3f3f3fca;
    border-bottom: 1px solid white;
    position: fixed;
    z-index: 1;
}
.mouse-coord-info{
    position: fixed;
    width: 250px;
    height: 30px;
    background-color: rgba(76, 74, 74, 0.781);
    right: 0;
    top:50px;
    z-index: 3;
    border-end-start-radius: 5px;
    border-bottom: 1px solid lightgray;
    border-left: 1px solid lightgray;
    padding: 0 5px 0 5px;
}
.account-login-logout{
    width: 100px;
    justify-content: space-between;
    align-self: center;
    padding: 0 10px;
}
.account-info{
    align-self: center;
    padding: 0 10px;
    margin-right: 10px;
}
.account-name{
    margin-right: 10px;
}
.toggle-button-style{
    align-self: center;
    margin-left: 20px;
}
</style>