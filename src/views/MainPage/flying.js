import { ref, getCurrentInstance, watch } from 'vue'

export const useFlyingApi = ()=>{
    const app = getCurrentInstance()
    const http = app.appContext.config.globalProperties.$http

    const flying = ref([])
    const loadingFly = ref(false)
    const creatingFly = ref(false)
    const addFlyShow = ref(false)
    const editFly = ref(null)
    const flyImageShow = ref(false)

    const addFlyEvent = ()=>{
        addFlyShow.value = true
    }

    const editFlyEvent = (fly) => {
        addFlyShow.value = true
        editFly.value = fly
    }

    const fetchFlying = (project_id)=>{
        loadingFly.value = true
        http.get('api/fly/get', {params: {'project_id': project_id } })
            .then((response)=>{
                if(response.statusText=='OK'){
                    flying.value = []
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
                        flying.value.push(new_fly)
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
                loadingFly.value = false
            })
    }

    const getFlyById = (id)=>{
        return flying.value.find(fly => fly.id === id);
    }

    const clickFlyImageEvent = (cmd) => {
        setFlyingPhotoActive(cmd.fly_id, cmd.photo_id)
        flyImageShow.value = true
    }

    const setAllFlyPhotosInactive = ()=>{
        flying.value.forEach(fly => {
            fly.photos.forEach(photo => {
                photo.active=false
            })
        });
    }

    const setFlyingPhotoActive = (fly_id, photo_id)=>{
        let fly = getFlyById(fly_id)
        fly.photos.forEach(photo=>{
            if(photo.id==photo_id){
                photo.active=true
            }
        })
    }

    watch(flyImageShow, (new_v) => {
        if(!new_v){
            setAllFlyPhotosInactive()
        }
      })

    return {
        loadingFly,
        flying,
        flyImageShow,
        creatingFly,
        addFlyShow,
        editFly,
        fetchFlying,
        addFlyEvent,
        editFlyEvent,
        getFlyById,
        clickFlyImageEvent,
        setAllFlyPhotosInactive,
        setFlyingPhotoActive
    }
}