import { ref, getCurrentInstance,computed, watch } from 'vue'
import { useStore } from 'vuex'

export const useFlyingMapApi = ( props, context)=>{
    const app = getCurrentInstance()
    const http = app.appContext.config.globalProperties.$http

    const key = ref(0)
    const menu = ref(null);
    const store = useStore()

    const active_photo = {
        fly_id: null,
        photo_id: null
    }

    const contextMenuParams = {
        target: null
    }

    const balloonTemplateFly = (point, fly,index)=>{
        return `
            <h5>${point.name}</h5>
            <p>lat:${point.coords[0]} lon:${point.coords[1]}</p>
            <img style='cursor: pointer;' id="${index}" height="100" src="${point.src}">
            <div>Дата полета: ${fly.at_fly}</div>
        `
    }

    const balloonOpenFlyEvent = (index, point_id, fly_id)=>{
        document.getElementById(index).addEventListener('click', clickImageFly);
        active_photo.fly_id = fly_id
        active_photo.photo_id = point_id
    }

    const ballonCloseFlyEvent = (index) => {
        document.getElementById(index).removeEventListener('click', clickImageFly);  
    }

    const clickImageFly = () => {
        context.emit('clickImage', active_photo)
    }

    const flyOpenEmit = (fly)=>{
        context.emit('deployFlyChange', {id: fly.id, deployed: true})
    }

    const closeFlyEmit = (fly)=>{
        context.emit('deployFlyChange', {id: fly.id, deployed: false})
    }

    const openContextMenuEvent = (e, fly) => {
        menu.value.open(e);
        contextMenuParams.target = fly
    }

    const contextDeleteEvent = ()=>{
        const headers =  {
            headers: {'Authorization': 'Bearer ' + store.state.account.token.token},
            data: {id: contextMenuParams.target.id}
        }
        http.delete('/api/fly/delete', headers).then((response)=>{
            if(response.status==200){
                context.emit('updateFlying')
                alert(`Полет ${contextMenuParams.target.name} удален`)
            }
        }).catch((error)=>{
            if (error.response.status == 400 && error.response.data.error=="forbiden"){
                alert('Недостаточно прав для удаления выбранного полета. Удалить полет может только его создатель.')
            }
        })
    }

    const contextEditEvent = () => {
        context.emit('editFly', contextMenuParams.target)
    }

    const nonDeployedFlying = computed(()=>{
        return props.flying.filter(fly=>!fly.deployed&&fly.photos.length!=0)
    })
    const deployedFlying = computed(()=>{
        return props.flying.filter(fly=>fly.deployed&&fly.photos.length!=0)
    })
    const zeroImageFly = computed(()=>{
        return props.flying.filter(fly=>!fly.deployed&&fly.photos.length==0)
    })

    watch(nonDeployedFlying, ()=>{
        key.value +=1
    })

    return {
        menu,
        nonDeployedFlying,
        deployedFlying,
        zeroImageFly,
        key,
        balloonTemplateFly,
        balloonOpenFlyEvent,
        ballonCloseFlyEvent,
        flyOpenEmit,
        closeFlyEmit,
        openContextMenuEvent,
        contextDeleteEvent,
        contextEditEvent
    }
}