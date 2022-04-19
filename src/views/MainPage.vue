<template>
    <div class="header-style flex-row" :style="{height:sideMenuProps.header_height}">
        <toggle-button
            class="toggle-button-style enable-icon"
            :target_id="'#'+sideMenuProps.target_canvas_id"
        />
        <div class="account-info enable-icon"
            @click="$router.push('profile')"
        >
            <span class="account-name text-white">Anonimus</span>
             <BootstrapIcon
                icon="person-circle"
                size="2x"
                variant="light"
                />           
        </div>
        <div class="account-login-logout flex-row">
            <BootstrapIcon
                icon="person-plus-fill"
                size="2x"
                variant="light"
                class="enable-icon"
                @click="$router.push('signup')"
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
    <div class="mouse-coord-info d-flex flex-row text-light justify-content-between align-items-center">
        <div>lat: {{mouseCoord[0]}}</div>
        <div>lon: {{mouseCoord[1]}}</div>
        <div>alt: {{mouseCoord[2]}}</div>
    </div>
    <div class="all-window-height w-100">
        <yandex-map-component
            v-model:mouseCoord="mouseCoord"
            :flying="flying"
            :objects="objects"
            @deployFly="deployFly"
        />
    </div>
    <projects-menu
        :canvas_props="sideMenuProps"
        :projects="searcherProjects"
        @targetUpdate="updateTargetProject"
        v-model="searchQuery"
    />
    <fly-object-menu
        :objects="objects"
        :flying="flying"
        v-if="viewFlyObjectMenu"
    />
    <loading
        v-model="loading"
    />
</template>

<script>
import YandexMapComponent from '@/components/YandexMapComponent.vue'
import ToggleButton from '@/components/ToggleButton.vue'
import ProjectsMenu from '@/components/ProjectsMenu.vue'
import Loading from '@/components/Loading.vue'
import FlyObjectMenu from '@/components/FlyObjectMenu.vue'

export default {
    components:{
        YandexMapComponent,
        ToggleButton,
        ProjectsMenu,
        Loading,
        FlyObjectMenu,
    },
    data(){
        return {
            sideMenuProps:{
                target_canvas_id: "sideMenu",
                header_height: '50px'
            },
            searchQuery: '',
            loading: false,
            projects:
            {
                target_project_id: null,
                all_projects: [
                    {id: 1, name: "Побережье", fly_count: 2, object_count:10},
                    {id: 2, name: "Сочи", fly_count: 1, object_count:2},
                    {id: 3, name: "Полеты в Смоленске", fly_count: 40, object_count:15},
                    {id: 4, name: "Полеты в ИПУ", fly_count: 10, object_count:30},
                    {id: 5, name: "Полеты в Смоленске", fly_count: 40, object_count:15},
                    {id: 6, name: "Полеты в Смоленске", fly_count: 40, object_count:15},
                    {id: 7, name: "Побережье", fly_count: 2, object_count:10},
                    {id: 8, name: "Побережье", fly_count: 2, object_count:10},
                    {id: 9, name: "Побережье", fly_count: 2, object_count:10},
                    {id: 10, name: "Полеты в ИПУ", fly_count: 10, object_count:30},
                    {id: 11, name: "Полеты в ИПУ", fly_count: 10, object_count:30},
                    {id: 12, name: "Полеты в ИПУ", fly_count: 10, object_count:30},
                ]
            },
            objects:[
                {id:1, name:'Объект 1', count: 2, at_first: '10-08-2022', at_last:"10-08-2022", chronology_ids:[1,2,3]},
                {id:2, name:'Объект 2', count: 3, at_first: '10-08-2022', at_last:"10-08-2022", chronology_ids:[1,2,3]},
                {id:3, name:'Объект 3', count: 4, at_first: '10-08-2022', at_last:"10-08-2022", chronology_ids:[1,2,3]},
                {id:4, name:'Объект 4', count: 5, at_first: '10-08-2022', at_last:"10-08-2022", chronology_ids:[1,2,3]},
                {id:5, name:'Объект 5', count: 6, at_first: '10-08-2022', at_last:"10-08-2022", chronology_ids:[1,2,3]},
                {id:6, name:'Объект 6', count: 7, at_first: '10-08-2022', at_last:"10-08-2022", chronology_ids:[1,2,3]},
                {id:7, name:'Объект 7', count: 8, at_first: '10-08-2022', at_last:"10-08-2022", chronology_ids:[1,2,3]},
            ],
            flying:[
                {id:1, name: "Полет 1", count: 10, at_fly: "10-01-2021", at_load: '11-02-2021', deployed: false, photos:[
                    {id:1, name:'photo1', coords:[55.737722, 37.732367], src: 'https://www.imgonline.com.ua/examples/bee-on-daisy.jpg'},
                    {id:2, name:'photo2', coords:[55.727722, 37.732367], src: 'https://www.ixbt.com/img/n1/news/2021/10/2/22459ff25f8eff76bddf34124cc2c85b16f4cd4a_large.jpg'},
                    {id:3, name:'photo3', coords:[55.757722, 37.732367], src: 'https://vypechka-online.ru/wp-content/uploads/2019/09/EQgJ4p77Aeo.jpg'},
                ]},
                {id:2, name: "Полет 2", count: 10, at_fly: "10-01-2021", at_load: '11-02-2021', deployed: false, photos:[
                    {id:3, name:'photo3', coords:[55.757722, 37.732367], src: 'https://www.imgonline.com.ua/examples/bee-on-daisy.jpg'},
                    {id:1, name:'photo1', coords:[55.737722, 37.732367], src: 'https://vypechka-online.ru/wp-content/uploads/2019/09/EQgJ4p77Aeo.jpg'},
                    {id:2, name:'photo2', coords:[55.727722, 37.732367], src: 'https://www.ixbt.com/img/n1/news/2021/10/2/22459ff25f8eff76bddf34124cc2c85b16f4cd4a_large.jpg'},
                    
                ]},
                {id:3, name: "Полет 3", count: 10, at_fly: "10-01-2021", at_load: '11-02-2021', deployed: false, photos:[
                    {id:2, name:'photo2', coords:[55.727722, 37.732367], src: 'https://www.ixbt.com/img/n1/news/2021/10/2/22459ff25f8eff76bddf34124cc2c85b16f4cd4a_large.jpg'},
                    {id:1, name:'photo1', coords:[55.737722, 37.732367], src: 'https://www.imgonline.com.ua/examples/bee-on-daisy.jpg'},
                    {id:3, name:'photo3', coords:[55.757722, 37.732367], src: 'https://vypechka-online.ru/wp-content/uploads/2019/09/EQgJ4p77Aeo.jpg'},
                ]}
            ],
            mouseCoord: [0,0,0]
        }
    },

    computed:{
        searcherProjects(){
            return this.projects.all_projects.filter(project=>project.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
        },
        viewFlyObjectMenu(){
            return this.objects.length != 0 && this.flying.length !=0
        }
    },
    methods:{
        updateTargetProject(id){
            this.projects.target_project_id = id
            this.loadProjectData()
        },
        loadProjectData(){
            this.loading = true
            setTimeout(()=>this.loading=false, 1000)
        },
        deployFly(id){
            let fly = this.flying.find(fly => fly.id === id);
            fly.deployed = true
        }
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
    margin-left: auto;
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