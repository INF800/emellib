export const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

export function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

//export function euclidean (x1, x2, y1, y2, horizontalWeight, verticalWeight){
export function euclidean (x1, y1, x2, y2, horizontalWeight=1, verticalWeight=1){
    return Math.sqrt( Math.pow((x1-x2)*horizontalWeight, 2) + Math.pow((y1-y2)*verticalWeight, 2) );
}