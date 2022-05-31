import { } from 'vue'

export const useObjectMapApi = ( context)=>{

    const active_object ={
        id: null
    }

    const balloonTemplateObject = (object, id)=>{
        return `
            <h5>${object.name}</h5>
            <p>lat:${object.coords[0]} lon:${object.coords[1]}</p>
            <img style='cursor: pointer;' id="${id}" height="100" src="${object.objects[object.objects.length-1].ref_photo}">
            <div>Дата создания: ${object.at_first}</div>
            <div>Количество записей: ${object.objects.length}</div>
        `
    }
    const balloonOpenObjectEvent = (object_id, index)=>{
        document.getElementById(index).addEventListener('click', clickImageObject);
        active_object.id = object_id
    }
    const ballonCloseObjectEvent = (index)=>{
        document.getElementById(index).removeEventListener('click', clickImageObject);  
    }
    const clickImageObject = ()=>{
        context.emit('clickObject', active_object)
    }
    const rightClickObject = (e, object_id)=>{
        context.emit('rightClickObject', object_id)
    }
    const rightClickMap = (e)=>{
        if(e.which==3){
            setTimeout(context.emit('rightClickMap', {}),200)
        }
    }

    return {
        balloonTemplateObject,
        balloonOpenObjectEvent,
        ballonCloseObjectEvent,
        rightClickObject,
        rightClickMap
    }
}