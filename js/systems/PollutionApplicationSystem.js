import { clamp } from "../utils/Utils.js";

export function apply(entity) {
    if (entity.pollution !== undefined && entity.pollutionDelta !== undefined) {
        entity.pollution += entity.pollutionDelta;
        entity.pollution = clamp(entity.pollution, 0, 100); //TODO: Make 100 constant
        entity.pollutionDelta = 0;
    }
}
