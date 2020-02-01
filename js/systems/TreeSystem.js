import { clamp } from "../utils/Utils.js";
import { COMPOST_USAGE_RATE, COMPOST_GROWTH_BOOST, MAX_POLLUTION_VALUE, POLLUTION_DAMAGE_FACTOR, TREE_RECOVERY_RATE } from "../gamelogic/MechanicParameters.js";

const MAX_TREE_LEVEL = 100;
const TREE_GROWTH_WATER_THRESHOLD = 10;

export function apply(entity) {
    if (entity.tree) {
        applyTreeGrowth(entity);
        applyTreeHealth(entity);
    }
}

function applyTreeGrowth(entity) {
    const waterEntities = entity.hood1.filter(e => e.water && e.water.level > TREE_GROWTH_WATER_THRESHOLD);
    if (waterEntities.length > 0) {
        if (!entity.compost || entity.compost === 0) {
            entity.tree.level = clamp(entity.tree.level + 1,
                0,
                MAX_TREE_LEVEL,
                );
        } else {
            entity.tree.level = clamp(
                entity.tree.level + 1 * COMPOST_GROWTH_BOOST,
                0,
                MAX_TREE_LEVEL,
            );
            entity.compost -= COMPOST_USAGE_RATE;
        }
    }
}

function applyTreeHealth(entity) {
    if (entity.pollution > 50) {
        entity.tree.health -= (entity.pollution - MAX_POLLUTION_VALUE * 0.5) * POLLUTION_DAMAGE_FACTOR;

    } else if (entity.pollution < 50) {
        entity.tree.health = Math.min(entity.tree.health + TREE_RECOVERY_RATE, 100);
    }

    if (entity.tree.health < 0) {
        delete entity.tree;
        console.log("Tree died!")
    }
}