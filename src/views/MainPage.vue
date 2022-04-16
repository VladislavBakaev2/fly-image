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
    <div class="all-window-height w-100">
        <yandex-map-component/>
    </div>
    <projects-menu
        :canvas_props="sideMenuProps"
        :projects="searcherProjects"
        @targetUpdate="updateTargetProject"
        v-model="searchQuery"
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

export default {
    components:{
        YandexMapComponent,
        ToggleButton,
        ProjectsMenu,
        Loading,
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
            }
        }
    },

    computed:{
        searcherProjects(){
            return this.projects.all_projects.filter(project=>project.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
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