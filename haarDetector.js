
// var HAAR = require('./dep/haar-detector.js');
// var faceHaardata = require('./cascades/haarcascade_frontalface_alt');

// export const createHaarDetector = (args) => {
//     // args
//     // ----
//     //  videoElement
//     //  canvasElementDisplay

//     const detector = new HAAR.Detector(faceHaardata)

//     return () => {
//         args.canvasElementDisplay.width = args.videoElement.offsetWidth;
//         args.canvasElementDisplay.height = args.videoElement.offsetHeight;
//         const ctx = args.canvasElementDisplay.getContext('2d');

//         detector
//             .image(args.videoElement, 1) // todo: remove `document.create ...`
//             //.interval(40)
//             .complete(function () {
//                 // processing done
//                 console.log(JSON.stringify(this.objects))
//                 var i, rect, l = this.objects.length;
//                 ctx.strokeStyle = "rgba(220,0,0,1)"; ctx.lineWidth = 10;
//                 ctx.strokeRect(this.Selection.x, this.Selection.y, this.Selection.width, this.Selection.height);
//                 ctx.strokeStyle = "rgba(75,221,17,1)"; ctx.lineWidth = 10;
//                 for (i = 0; i < l; i++) {
//                     //console.log(this.objects[i])
//                     rect = this.objects[i];
//                     ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
//                 }
//             }).detect(1, 1.25, 0.1, 1, 0.2, true);

//         ctx.drawImage(args.videoElement, 0, 0)
//     }

// }