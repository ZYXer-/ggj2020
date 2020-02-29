import { clamp } from '../utils/Utils.js';
import { MAX_POLLUTION_VALUE } from '../gamelogic/MechanicParameters.js';


export function apply(entity) {
    if (entity.pollution !== undefined && entity.pollutionDelta !== undefined) {
        entity.pollution += entity.pollutionDelta;
        entity.pollution = clamp(entity.pollution, 0, MAX_POLLUTION_VALUE);
        entity.pollutionDelta = 0;
    }
}
