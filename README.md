## ML Library

Property of Crejo.Fun

### Motion Detection

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