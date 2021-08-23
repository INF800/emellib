importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js")
// importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core") // not needed
// importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter") // not needed
// importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl") // doesn't work inside worker
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm") // works inside worker
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@0.0.3")

let model, canvas, ctx, ic, intervalId;

const createDetector = async (modelName = 'lightening') => {
    let modelType = null;
    if (modelName === 'thunder') {
        modelType = poseDetection.movenet.modelType.SINGLEPOSE_THUNDER;
    } else if (modelName === 'lightening') {
        modelType = poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING;
    } else {
        modelType = poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING;
    }

    const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        { modelType: modelType }
    );

    // await detector.load();
    // this below line hangs the browser when run in main thread.
    // console.log('[w-pose]', 'loading model into device memory...')
    // await detector.estimatePoses(tf.ones([224, 224, 3]))
    return detector
};

const setupModel = async () => {

    // console.log('[w-pose]', 'setting wasm backend...')
    await tf.setBackend('wasm')

    console.log('[w-pose]', 'loading model started ....')
    model = await createDetector('lightening') // global
    
    console.log("===============================")
    console.log('[w-pose]', 'model load done!!')
    console.log("===============================")

    self.postMessage({msg: '[w-pose] model loaded!'})
}

setupModel()

addEventListener('message', async (e)=>{
    if (e.data.offscreen){
        console.log('[w-pose]', 'initializing offscreen canvas and ctx...')
        canvas = e.data.offscreen // global
        ctx = canvas.getContext('2d')
    } else if (e.data.imageBitmap && ctx){
        console.log('[w-pose]', 'trying to make predictions...')
        if (!model){
            console.log('[w-pose]', 'waiting for model to load. can not do predictions...')
            return
        }

        canvas.width = e.data.imageBitmap.width
        canvas.height = e.data.imageBitmap.height
        ctx.drawImage(e.data.imageBitmap, 0, 0)

        // const preds = await model.estimatePoses(e.data.imageBitmap)
        const preds = await model.estimatePoses(canvas)
        // console.log('[w-pose]', 'predictions done! preds:', preds)

        // detector.keypointIndexByName.keypointIndexByName:
        const keypoints = {
            left_ankle: preds[0].keypoints[15],
            left_ear: preds[0].keypoints[3],
            left_elbow: preds[0].keypoints[7],
            left_eye: preds[0].keypoints[1],
            left_hip: preds[0].keypoints[11],
            left_knee: preds[0].keypoints[13],
            left_shoulder: preds[0].keypoints[5],
            left_wrist: preds[0].keypoints[9],
            nose: preds[0].keypoints[0],
            right_ankle: preds[0].keypoints[16],
            right_ear: preds[0].keypoints[4],
            right_elbow: preds[0].keypoints[8],
            right_eye: preds[0].keypoints[2],
            right_hip: preds[0].keypoints[12],
            right_knee: preds[0].keypoints[14],
            right_shoulder: preds[0].keypoints[6],
            right_wrist: preds[0].keypoints[10],
        }

        self.postMessage({preds: keypoints, canvasWidth: canvas.width, canvasHeight: canvas.height})
    }
})