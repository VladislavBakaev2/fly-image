import { ref, getCurrentInstance, computed } from 'vue'

export const useObjectsApi = ()=>{
    const app = getCurrentInstance()
    const http = app.appContext.config.globalProperties.$http

    const objects = ref([])
    const creatingObject = ref(null)
    const loadingObject = ref(false)
    const objectImageShow = ref(false)

    const activeObject = computed(()=>{
        return objects.value.find(object=>object.active)
    })

    const fetchObjects = (project_id) => {
        loadingObject.value = true
        http.get('api/object/get', {params: {'project_id': project_id } })
            .then((response)=>{
                if(response.statusText=='OK'){
                    objects.value=[]
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
                        objects.value.push(new_object)
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
                loadingObject.value = false
            })
    }

    const clickObjectEvent = (cmd)=>{
        let target_object = objects.value.find(object=>object.id==cmd.id)
        target_object.active = true
        objectImageShow.value = true
    }

    const setCreatingObjectEvent = (object)=>{
        creatingObject.value = object
    }

    const setAllObjectsInactive = ()=>{
        objects.value.forEach(object => {
            object.active = false
        });
    }

    const createObject = async (target_project_id, mouseCoord, user_token, object_id=null)=>{
        let requestData = {}
        requestData = creatingObject.value
        requestData.project_id=target_project_id
        requestData.target_id=object_id
        requestData.coordinate = mouseCoord[0]+';'+mouseCoord[1]

        const headers =  {
            headers: {'Authorization': 'Bearer ' + user_token}
        }
        try{
            const response = await http.post('/api/object/create', requestData, headers)
            if(response.status == 201){
                creatingObject.value = null
            }
        }
        catch (e){
            console.error(e)
        }
    }

    const deleteObjectElemEvent = (data)=>{
        if(data.arr_id){
            objects.value.forEach((object)=>{
                if(data.id == object.id){
                    object.objects.splice(data.arr_id,1)
                }
            })
        }
        else{
            let target_index = -1
            for(let i=0; i<objects.value.length; i++){
                if(data.id == objects.value[i].id){
                    target_index = i
                }
            }
            if (target_index !=-1){
                objects.value.splice(target_index,1)
            }

        }

    }

    return {
        objects,
        creatingObject,
        activeObject,
        loadingObject,
        objectImageShow,
        fetchObjects,
        clickObjectEvent,
        setCreatingObjectEvent,
        setAllObjectsInactive,
        createObject,
        deleteObjectElemEvent
    }
}