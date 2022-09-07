const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const faceMeshResults = {};

const onResults = (results) => {
    canvasCtx.save();
    const w = canvasElement.width;
    const h = canvasElement.height;
    canvasCtx.clearRect(0,0,w,h);

    canvasCtx.drawImage(videoElement, 0, 0);
    canvasCtx.fillStyle = '#00003355';
    canvasCtx.fillRect(0,0,w,h);
    
    faceMeshResults.results = results;

    if(results.multiFaceLandmarks){
        for(const landmarks of results.multiFaceLandmarks){
            const wireColor = '#c0c0c070';
            const eyeColor = '#ff3030';
            const faceColor = '#e0e0e0';

            drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {color: wireColor, lineWidth:1 });
            
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {color: eyeColor, lineWidth:1 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {color: eyeColor, lineWidth:1 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {color: eyeColor, lineWidth:1 });

            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {color: eyeColor, lineWidth:1 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {color: eyeColor, lineWidth:1 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {color: eyeColor, lineWidth:1 });

            drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {color: faceColor, lineWidth:1 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, {color: faceColor, lineWidth:1 });
        }
    }
    canvasCtx.restore();
}

const faceMesh = new FaceMesh({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    }
});
faceMesh.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async()=>{
        await faceMesh.send({ image: videoElement});
    },
    width: 640,
    height: 480
});
camera.start();

canvasElement.onclick = (event) => {
    capture(event);
}

const capture = (evt) => {
    console.log("capture");
    console.log(faceMeshResults.results);
}

export { };