import { clamp } from "../utils/Utils.js";
const MAX_WATER_LEVEL = 100;

const EVAPORATION_FIX = 2.0;
export function apply(entity) {
    if (entity.water) {
        if (entity.water.delta <= 0) {
            entity.water.delta -= EVAPORATION_FIX;
        }
        if (entity.water.source) {
            entity.water.level = MAX_WATER_LEVEL;
        } else {
            entity.water.level = clamp(entity.water.level + entity.water.delta, 0, MAX_WATER_LEVEL)
        }
        entity.water.delta = 0;
    }
}