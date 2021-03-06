import {clamp} from '../utils/Utils.js';
import {
    FERTILIZER_GROWTH_BOOST,
    FERTILIZER_USAGE_RATE,
    MAX_POLLUTION_VALUE,
    POLLUTION_DAMAGE_FACTOR,
    TREE_RECOVERY_RATE
} from '../gamelogic/MechanicParameters.js';
import {MAX_TREE_LEVEL} from '../gamelogic/MechanicParameters.js';

const TREE_GROWTH_WATER_THRESHOLD = 10;

export function apply(entity) {
    if (entity.tree && entity.tree.health > 0) {
        applyTreeGrowth(entity);
        applyTreeHealth(entity);
    }
}

function applyTreeGrowth(entity) {
    const waterEntities = entity.hood1.filter(e => e.water && e.water.level > TREE_GROWTH_WATER_THRESHOLD);
    const sprinklerEntities = entity.hood2.filter(e => e.sprinkler && e.waterConsumer.supplied);
    if(waterEntities.length > 0 || sprinklerEntities.length > 0) {
        if(!entity.fertilizer || entity.fertilizer === 0) {
            entity.tree.level = clamp(entity.tree.level + 1,
                0,
                MAX_TREE_LEVEL,
            );
        } else {
            entity.tree.level = clamp(
                entity.tree.level + 1 * FERTILIZER_GROWTH_BOOST,
                0,
                MAX_TREE_LEVEL,
            );
            entity.fertilizer -= FERTILIZER_USAGE_RATE;
        }
    }
}

// function applyTreeGrowth(entity) {
//
// }

function applyTreeHealth(entity) {
    if (entity.pollution > 50) {
        entity.tree.health -= (entity.pollution - MAX_POLLUTION_VALUE * 0.5) * POLLUTION_DAMAGE_FACTOR;

    } else if (entity.pollution < 50) {
        entity.tree.health = Math.min(entity.tree.health + TREE_RECOVERY_RATE, 100);
    }

    if (entity.tree.health < 0) {
        entity.tree.health = 0;
    }
}