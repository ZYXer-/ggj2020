import { min, rand } from "../utils/Utils.js";
import { TREE_POLLUTION_REDUCTION_FACTOR } from "../gamelogic/MechanicParameters.js";

export function apply(entity) {
    const neighbour = entity.hood1[rand(0, entity.hood1.length - 1)];
    if (neighbour.pollution > entity.pollution){
        entity.pollutionDelta += min(1, neighbour.pollution - entity.pollution);
    }

    const treeLevelSum = entity.hood3.filter(tile => tile.tree && tile.tree.health > 0)
        .map(tile => tile.tree.level)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    if (treeLevelSum > 0) {
        entity.pollutionDelta -= treeLevelSum * TREE_POLLUTION_REDUCTION_FACTOR;
    }
}
