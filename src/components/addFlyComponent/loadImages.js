import { ref } from 'vue'

export const useLoadImagesApi = ()=>{

    let images = ref([])
    let countImages = ref(0)
    let inputData = null
    const front = 2
    let currentStep = 0

    function handleEvent(event, image, reader) {
        if (['loadend', 'load'].includes(event.type)) {
            image.currentProgress = '100%';
            image.fileUrl = new Image()
            image.fileUrl.src = reader.result;
            if(images.value.filter(data=>data.fileUrl==null)==0){
                currentStep+=1
                setTimeout(loadDataPiece(), 500)
            }
        }
        if (event.type === 'progress') {
            image.currentProgress = `${(event.loaded / image.totalSize).toFixed(2) * 100}%`;
        }
        if (event.type === 'loadstart') {
            image.totalSize = event.total;
        }
    }

    function addListeners(reader, image) {
        reader.addEventListener('loadstart', (e) => handleEvent(e, image, reader)); 
        reader.addEventListener('load', (e) => handleEvent(e, image, reader));
        reader.addEventListener('loadend', (e) => handleEvent(e, image, reader));
        reader.addEventListener('progress', (e) => handleEvent(e, image, reader));
        reader.addEventListener('error', (e) => handleEvent(e, image, reader));
        reader.addEventListener('abort', (e) => handleEvent(e, image, reader));
    }

    function loadDataPiece(){
        let end = inputData.length > currentStep*front + front ? currentStep*front + front : inputData.length
        for(let i=currentStep*front; i<end; i++){
            let selectedFile = inputData[i]
            if (selectedFile) {
                const reader = new FileReader();
                images.value.push({
                    fileUrl: null,
                    totalSize: 0,
                    currentProgress: '0%',
                    name: selectedFile.name
                })
                addListeners(reader, images.value[images.value.length-1]);
                reader.readAsDataURL(selectedFile);                
            }
        }
    }

    function handleSelected(e) {
        images.value=[]
        inputData = e.target.files
        countImages.value = e.target.files.length
        currentStep = 0
        loadDataPiece()
    }

    return {
        images,
        countImages,
        handleSelected
    }
}