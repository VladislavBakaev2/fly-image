import { ref, getCurrentInstance, computed } from 'vue'

export const useProjectsApi = ()=>{
    const app = getCurrentInstance()
    const http = app.appContext.config.globalProperties.$http

    const projects = ref([])
    const target_project_id = ref(null)
    const searchQuery = ref('')
    const loadingProject = ref(false)
    const addProjectShow = ref(false)
    const deleteProjectShow = ref(false)
    const deletingProject = ref({name:''})

    const fetchProjects = ()=>{
        loadingProject.value = true
        http.get('api/project/get')
            .then((response)=>{
                if(response.statusText=='OK'){
                    projects.value = []
                    target_project_id.value = null
                    response.data.forEach((project)=>{
                        let new_project = {}
                        new_project.id = project.id
                        new_project.author = project.author
                        new_project.fly_count = project.fly_count
                        new_project.object_count = project.object_count
                        new_project.name = project.name
                        new_project.at_create = project.at_create.split('T')[0]
                        new_project.at_update = project.at_update.split('T')[0]
                        projects.value.push(new_project)
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
            .finally(()=>{
                loadingProject.value = false
            })
    }

    const getProjectById = (id)=>{
        var targetProject = null
        projects.value.forEach((project)=>{
            if(project.id === id){
                targetProject = project
            }
        })
        return targetProject
    }

    const searcherProjects =computed(()=>{
        return projects.value.filter(project=>project.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    })

    const deleteProjectEvent =(id)=>{
        const project = getProjectById(id)
        deletingProject.value = project
        deleteProjectShow.value = true
    }

    return {
        projects,
        target_project_id,
        fetchProjects,
        searcherProjects,
        searchQuery,
        loadingProject,
        addProjectShow,
        deleteProjectShow,
        deletingProject,
        deleteProjectEvent
    }
}