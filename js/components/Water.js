export const MAX_WATER_LEVEL = 100;


export function newWater(isSource) {
    return {
        source: isSource,
        level: isSource ? MAX_WATER_LEVEL : 0,
        flow: isSource ? MAX_WATER_LEVEL : 0,
        output: null,
    }
}