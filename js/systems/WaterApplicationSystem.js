import { clamp, max } from "../utils/Utils.js";
import { MAX_WATER_LEVEL } from "../components/Water.js";


export function apply(entity) {

    if (entity.water) {
        if(!entity.water.source) {
            entity.water.level = clamp(entity.water.flow, 0, MAX_WATER_LEVEL);
            entity.water.flow = 0;
        }

    }
}