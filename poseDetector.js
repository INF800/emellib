import * as poseDetection from '@tensorflow-models/pose-detection';

export const createDetector = async (videoElement, modelName = 'lightening') => {
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
    await detector.estimatePoses(videoElement)
    return detector;
};

// keypointIndexByName:
// left_ankle: 15
// left_ear: 3
// left_elbow: 7
// left_eye: 1
// left_hip: 11
// left_knee: 13
// left_shoulder: 5
// left_wrist: 9
// nose: 0
// right_ankle: 16
// right_ear: 4
// right_elbow: 8
// right_eye: 2
// right_hip: 12
// right_knee: 14
// right_shoulder: 6
// right_wrist: 10

class OutlierRemoverBool{
    constructor(size=10){
        this._size=size;
        this._arr=[];
    }

    push(ele){
        const len = this._arr.push(ele)
        if (len > this._size) { this._arr.shift() }
        // console.log(this._arr)
        return this
    }

    removeOutlier(){
        return this._arr.every((ele)=>{
            return ele===true;
        })
    }
}

let queueBool = new OutlierRemoverBool()

export const isBodyInFrame = async (detector, frame, thresh=0.2) => {
    // frame can ve video element or tensor or image.
    // nose will not be visible if person turns around
    const poses = await detector.estimatePoses(frame);

    const nose = poses[0].keypoints[detector.keypointIndexByName.nose];
    const leftElbow = poses[0].keypoints[detector.keypointIndexByName.left_elbow];
    const rightElbow = poses[0].keypoints[detector.keypointIndexByName.right_elbow];
    const leftAnkle = poses[0].keypoints[detector.keypointIndexByName.left_ankle];
    const rightAnkle = poses[0].keypoints[detector.keypointIndexByName.right_ankle];
    const keyPoints = [nose, leftElbow, rightElbow, leftAnkle, rightAnkle]

    // const xs = keyPoints.map((obj)=>{return obj.x})
    // const ys = keyPoints.map((obj)=>{return obj.y})
    const scores = keyPoints.map((obj)=>{return (obj.score>thresh)?true:false;})

    const result = scores.every((ele)=>{
        return ele===true
    })

    return queueBool.push(result).removeOutlier()
};


export const getBodyBoundingBox = async (detector, frame) => {
    // frame can ve video element or tensor or image.
    const poses = await detector.estimatePoses(frame);
    const xs = poses[0].keypoints.map((obj)=>{return obj.x})
    const ys = poses[0].keypoints.map((obj)=>{return obj.y})

    return [
        Math.min(...xs),
        Math.max(...xs),
        Math.min(...ys),
        Math.max(...ys),
    ]
};