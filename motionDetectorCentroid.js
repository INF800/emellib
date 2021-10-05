import * as utils from './utils'

export const createEnergyScoreGetter = (args) => {
    // args:
    // ----
    //  videoElement: webcam streaming must be happening in this video element 
    //  canvasElementHelper: hidden canvas element used for motion detection
    //  canvasElementDisplay: final canvas element where the threshold scores will be used. If `null`, not displayed.
    //  thresh: step function for blended pixels. 150 works just fine.
    //  alpha: 0.5 works fine

    let imgData = null;
    let imgDataPrev = [];
    let version = 0;
    let thresh = args.thresh
    let alpha = args.alpha;
    let _isFirstTimeCall = true
    let curEnergyScore=0;
    let curCentroid = [0, 0];
    let centroidPrev = [0, 0];

    return (decay=0.1, widthFator=2, areaFilter=0.01, decayCentroid=0.25,
            horizontalWeight=1, verticalWeight=1) => {
        
        args.canvasElementHelper.width = args.videoElement.offsetWidth;
        args.canvasElementHelper.height = args.videoElement.offsetHeight;
        const ctx = args.canvasElementHelper.getContext('2d');

        let ctxFinal = null
        if (args.canvasElementDisplay) {
            args.canvasElementDisplay.width = args.videoElement.offsetWidth;
            args.canvasElementDisplay.height = args.videoElement.offsetHeight;
            ctxFinal = args.canvasElementDisplay.getContext('2d');
        }

        ctx.drawImage(args.videoElement, 0, 0);

        // Must capture image data in new instance as it is a live reference.
        // Use alternative live referneces to prevent messed up data.
        imgDataPrev[version] = ctx.getImageData(0, 0, args.canvasElementHelper.width, args.canvasElementHelper.height);
        version = (version == 0) ? 1 : 0;

        if (_isFirstTimeCall) {
            _isFirstTimeCall = false
            return 0
        }

        imgData = ctx.getImageData(0, 0, args.canvasElementHelper.width, args.canvasElementHelper.height);

        var length = imgData.data.length;
        var x = 0;
        var [i, j, cnt, sumx, sumy] = [0, 0, 0, 0, 0];
        while (x < length) {
            // GreyScale.
            var av = (imgData.data[x] + imgData.data[x + 1] + imgData.data[x + 2]) / 3;
            var av2 = (imgDataPrev[version].data[x] + imgDataPrev[version].data[x + 1] + imgDataPrev[version].data[x + 2]) / 3;
            var blended = alpha * (255 - av) + ((1 - alpha) * av2);

            // Step function.
            // moving pixels will be balck.
            // still pixels will be white.
            blended = (blended < thresh) ? 255 : 0;

            imgData.data[x] = blended; // r
            imgData.data[x + 1] = blended; // g
            imgData.data[x + 2] = blended; // b
            imgData.data[x + 3] = 255; // a
            x += 4;

            // centroid using actual coordinates
            if (blended===0){
                sumx+=i;
                sumy+=j;
                cnt+=1; // area
            }
            i=(i+1)%args.canvasElementHelper.width;
            j=(i===0)?(j+1):j;
        }

        // centroid
        var intermediateCentroid = [sumx/(cnt+0.000001), sumy/(cnt+0.000001)]
        curCentroid = [
            ((1-decayCentroid)*intermediateCentroid[0]) + (decayCentroid*curCentroid[0]),
            ((1-decayCentroid)*intermediateCentroid[1]) + (decayCentroid*curCentroid[1])
        ]
        
        if (ctxFinal) {
            ctxFinal.putImageData(imgData, 0, 0);
            ctxFinal.beginPath();
            ctxFinal.fillStyle = "#FF0000";
            ctxFinal.fillRect(curCentroid[0], curCentroid[1], 20, 20);
            ctxFinal.stroke();
        }

        var dist = utils.euclidean(centroidPrev[0], centroidPrev[1], curCentroid[0], curCentroid[1], horizontalWeight, verticalWeight);
        centroidPrev = curCentroid
        if (cnt<(areaFilter*args.canvasElementHelper.width*args.canvasElementHelper.height)) {
            console.log("ignoring")
            dist=0
        }

        var intermediateEnergyScore = utils.clamp((dist/(args.canvasElementHelper.width/widthFator))*100 , 0, 100)
        curEnergyScore = ((1-decay)*intermediateEnergyScore) + (decay*curEnergyScore)

        return curEnergyScore
    }

}