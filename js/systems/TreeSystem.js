import { clamp } from "../utils/Utils.js";

const MAX_TREE_LEVEL = 100;
const TREE_GROWTH_WATER_THRESHOLD = 10;

export function apply(entity) {
    if (entity.tree) {
        const waterEntities = entity.hood1.filter(e => e.water && e.water.level > TREE_GROWTH_WATER_THRESHOLD)
        if (waterEntities.length > 0) {
            entity.tree.level = clamp(entity.tree.level + 1, 0, MAX_TREE_LEVEL);
        }
    }
}