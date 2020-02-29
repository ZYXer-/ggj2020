import { min, rand } from '../utils/Utils.js';
import {
    TREE_POLLUTION_REDUCTION_FACTOR ,
    TREE_POLLUTION_REDUCTION_DISTANCE_FACTOR,
    TREE_POLLUTION_REDUCTION_CHANCE,
    MIN_POLLUTION_GROWTH,
} from '../gamelogic/MechanicParameters.js';
import { trueOrFalse } from '../utils/Utils.js';


export function apply(entity) {
    const neighbour = entity.hood1[rand(0, entity.hood1.length - 1)];
    // Growth
    if (neighbour.pollution > entity.pollution){
        entity.pollutionDelta += min(
            MIN_POLLUTION_GROWTH,
            0.5
            , neighbour.pollution - entity.pollution
        );
    }

    // Reduction
    const treeLevelSum = entity.hood3.filter(e => e.tree && e.tree.health > 0 && trueOrFalse(TREE_POLLUTION_REDUCTION_CHANCE))
        .reduce(
            (accumulator, e) => {
                let power = 0;
                if (e === entity) {
                    power = 0;
                } else if ( entity.hood1.includes(e)) {
                    power = 1;
                } else if ( entity.hood2.includes(e)) {
                    power = 2;
                } else if ( entity.hood3.includes(e)) {
                    power = 3;
                }
                return accumulator + e.tree.level * Math.pow(TREE_POLLUTION_REDUCTION_DISTANCE_FACTOR, power);
            }
            , 0);
    if (treeLevelSum > 0) {
        entity.pollutionDelta -= treeLevelSum * TREE_POLLUTION_REDUCTION_FACTOR;
    }
}
