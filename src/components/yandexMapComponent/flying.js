import { ref, computed, watch } from 'vue'

export const useFlyingMapApi = ( props, context)=>{

    const key = ref(0)
    const menu = ref(null);

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
        console.log('delete')
    }
    const contextEditEvent = () => {
        context.emit('editFly', contextMenuParams.target)
    }

    const nonDeployedFlying = computed(()=>{
        return props.flying.filter(fly=>!fly.deployed)
    })
    const deployedFlying = computed(()=>{
        return props.flying.filter(fly=>fly.deployed)
    })

    watch(nonDeployedFlying, ()=>{
        key.value +=1
    })

    return {
        menu,
        nonDeployedFlying,
        deployedFlying,
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