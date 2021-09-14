export const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

export function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

export function euclidean (x1, x2, y1, y2){
    return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
}