import { max, clamp } from "../utils/Utils.js";


export const MAX_WATER_LEVEL = 100;
const EVAPORATION = 1;


export function apply(entity) {
    if (entity.water) {
        if(entity.water.source) {
            entity.water.level = MAX_WATER_LEVEL;

        } else {
            const waterNeighbors = entity.hood1.filter(e => e.water && e !== entity);

            let maxNeighborLevel = 0;
            let minNeighborLevel = entity.water.level;
            let minNeighbor = null;

            waterNeighbors.forEach(waterNeighbor => {
                maxNeighborLevel = max(maxNeighborLevel, waterNeighbor.water.level);
                if(waterNeighbor.water.level < minNeighborLevel) {
                    minNeighborLevel = waterNeighbor.water.level;
                    minNeighbor = waterNeighbor;
                }
            });

            entity.water.flow += maxNeighborLevel - EVAPORATION;

            entity.water.output = minNeighbor;

        }

    }
}