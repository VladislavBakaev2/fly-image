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
            @deployFlyChange="deployFlyChange"
            @clickImage="clickImage"
            @clickObject="clickObject"
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
    <fly-image-component
        v-model:show="flyImageShow"
        :flying="flying"
    />
</template>

<script>
import YandexMapComponent from '@/components/YandexMapComponent.vue'
import ToggleButton from '@/components/ToggleButton.vue'
import ProjectsMenu from '@/components/ProjectsMenu.vue'
import Loading from '@/components/Loading.vue'
import FlyObjectMenu from '@/components/FlyObjectMenu.vue'
import FlyImageComponent from '../components/FlyImageComponent.vue'

export default {
    components:{
        YandexMapComponent,
        ToggleButton,
        ProjectsMenu,
        Loading,
        FlyObjectMenu,
        FlyImageComponent,
    },
    data(){
        return {
            sideMenuProps:{
                target_canvas_id: "sideMenu",
                header_height: '50px'
            },
            searchQuery: '',
            loading: false,
            flyImageShow: false,
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
                {id:1, name:'Объект 1', at_first: '10-08-2022', at_last:"10-08-2022", commentary: 'aurhvlierhvil uehrvwiuervbweirbuv arhferwhf fiweuhfiwuef woieuhfwoiuhfw owierufhw ierfu wrfiuhw eriofuhw erfih werhf owieruhfwoie', coords: [55.787722, 37.732367],objects:[
                    {id: 1, ref_photo: 'https://www.imgonline.com.ua/examples/bee-on-daisy.jpg', commentary: 'объект1', box: []},
                    {id: 2, ref_photo: 'https://www.ixbt.com/img/n1/news/2021/10/2/22459ff25f8eff76bddf34124cc2c85b16f4cd4a_large.jpg', commentary: 'объект2', box: []},
                    {id: 3, ref_photo: 'https://vypechka-online.ru/wp-content/uploads/2019/09/EQgJ4p77Aeo.jpg', commentary: 'объект3', box: []},
                ]},
                {id:2, name:'Объект 2', at_first: '10-08-2022', at_last:"10-08-2022", commentary: '', coords: [55.717722, 37.732367],objects:[
                    {id: 1, ref_photo: 'https://www.imgonline.com.ua/examples/bee-on-daisy.jpg', commentary: 'объект1', box: []},
                ]},
                {id:3, name:'Объект 3', at_first: '10-08-2022', at_last:"10-08-2022", commentary: '', coords: [55.787722, 37.752367],objects:[
                    {id: 1, ref_photo: 'https://www.imgonline.com.ua/examples/bee-on-daisy.jpg', commentary: 'объект1', box: []},
                ]},
                {id:4, name:'Объект 4', at_first: '10-08-2022', at_last:"10-08-2022", commentary: '', coords: [55.787722, 37.762367],objects:[
                    {id: 1, ref_photo: 'https://www.imgonline.com.ua/examples/bee-on-daisy.jpg', commentary: 'объект1', box: []},
                ]},
            ],
            flying:[
                {id:1, name: "Полет 1", count: 10, at_fly: "10-01-2021", at_load: '11-02-2021', deployed: false, photos:[
                    {id:1, name:'photo1', active:false, coords:[55.737722, 37.732367], src: 'https://www.imgonline.com.ua/examples/bee-on-daisy.jpg'},
                    {id:2, name:'photo2', active:false, coords:[55.736722, 37.732367], src: 'https://www.ixbt.com/img/n1/news/2021/10/2/22459ff25f8eff76bddf34124cc2c85b16f4cd4a_large.jpg'},
                    {id:3, name:'photo3', active:false, coords:[55.735722, 37.732367], src: 'https://vypechka-online.ru/wp-content/uploads/2019/09/EQgJ4p77Aeo.jpg'},
                ]},
                {id:2, name: "Полет 2", count: 10, at_fly: "10-01-2021", at_load: '11-02-2021', deployed: false, photos:[
                    {id:3, name:'photo3', active:false, coords:[55.757722, 37.732367], src: 'https://www.imgonline.com.ua/examples/bee-on-daisy.jpg'},
                    {id:1, name:'photo1', active:false, coords:[55.753722, 37.732367], src: 'https://vypechka-online.ru/wp-content/uploads/2019/09/EQgJ4p77Aeo.jpg'},
                    {id:2, name:'photo2', active:false, coords:[55.751722, 37.732367], src: 'https://www.ixbt.com/img/n1/news/2021/10/2/22459ff25f8eff76bddf34124cc2c85b16f4cd4a_large.jpg'},
                    
                ]},
                {id:3, name: "Полет 3", count: 10, at_fly: "10-01-2021", at_load: '11-02-2021', deployed: false, photos:[
                    {id:2, name:'photo2', active:false, coords:[55.723722, 37.732367], src: 'https://www.ixbt.com/img/n1/news/2021/10/2/22459ff25f8eff76bddf34124cc2c85b16f4cd4a_large.jpg'},
                    {id:1, name:'photo1', active:false, coords:[55.724722, 37.732367], src: 'https://www.imgonline.com.ua/examples/bee-on-daisy.jpg'},
                    {id:3, name:'photo3', active:false, coords:[55.725722, 37.732367], src: 'https://vypechka-online.ru/wp-content/uploads/2019/09/EQgJ4p77Aeo.jpg'},
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
        deployFlyChange(cmd){
            let fly = this.flying.find(fly => fly.id === cmd.id);
            fly.deployed = cmd.deployed
        },
        clickImage(cmd){
            let target_fly = this.flying.find(fly=>fly.id == cmd.fly_id)
            let target_photo = target_fly.photos.find(photo=>photo.id==cmd.photo_id)
            target_photo.active = true
            this.flyImageShow = true
        },
        clickObject(cmd){
            console.log(cmd)
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