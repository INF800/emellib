export const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

export function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}