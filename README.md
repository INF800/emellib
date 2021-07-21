## ML Library

Maintained by Crejo.Fun

### 1. Motion Detection

```js
// create getter.
const getEnergyScore = ml.motionDetector.createEnergyScoreGetter({
    videoElement: webcamVideo.current, // localstream should be playing here
    canvasElementHelper: canvas1.current, // usually this is hidden.
    canvasElementDisplay: canvas2.current, // `null` if you don't want to do extra processing to display
    thresh: 150, // between [0, 255]. `150` works just fine.
    alpha: 0.5 // between [0, 1]. `0.5` works just fine.
})

// inside setInterval
const id = window.setInterval(() => {
    const score = getEnergyScore()
    console.log('score:', score)
}, 32);
```

See full template for react app [here](https://codesandbox.io/s/wispy-frost-lyx4p) in codesandbox.

### 2. Body Detection
```js

// load detector. takes time.
const detector = await ml.poseDetector.createDetector(webcamVideo.current);

....

// inside setinterval
const isCorrectFrame = await ml.poseDetector.isBodyInFrame(detector, webcamVideo.current);
```

See full template for react app [here](https://codesandbox.io/s/competent-bhabha-wh3hv?file=/src/App.js) in codesandbox.


### 3. Haar Cascade Detection

**Note:** This implementation needs to be optimized

```js
// create getter.
const detect = ml.haarDetector.createHaarDetector({
    videoElement: webcamVideo.current, // localstream should be playing here
    canvasElementDisplay: canvasDispaly.current // for display only
})

// inside setInterval
const id = window.setInterval(() => {
    detect()
}, 32);
```

Temporary template can be found [here](https://codesandbox.io/s/hidden-river-pqm5r) in codesandbox