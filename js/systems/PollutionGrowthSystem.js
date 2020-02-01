import { min, rand } from "../utils/Utils.js";

export function apply(entity) {
    const neighbour = entity.hood1[rand(0, entity.hood1.length - 1)];
    if (neighbour.pollution > entity.pollution){
        entity.pollutionDelta += min(2, neighbour.pollution - entity.pollution);
    }

    const trees = entity.hood3.filter(tile => tile.tree > 0);
    if (trees.length > 0) {
        entity.pollutionDelta -= 1;
    }
}
