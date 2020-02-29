import Vec2 from '../utils/Vec2.js';
import { newWater } from '../components/Water.js';
import { clamp, rand, randFloat, trueOrFalse } from '../utils/Utils.js';
import { newTree } from '../components/Tree.js';
import { MAX_POLLUTION_VALUE } from '../gamelogic/MechanicParameters.js';
import { getTileByCoordinates, NUM_TILES_HEIGHT, NUM_TILES_WIDTH } from '../Entities.js';

/**
 * Generates the start world for the game
 * @param entities
 */
export function generateWorld(entities) {
    const center = new Vec2(
        Math.ceil(NUM_TILES_WIDTH / 2),
        Math.floor(NUM_TILES_HEIGHT / 2),
    );

    getTileByCoordinates(center).water = newWater(true);
    getTileByCoordinates(center).source = true;

    for (const entity of entities) {
        const distance = entity.position.subtract(center).norm();

        if (distance > 1.5 && distance < 3.5 && trueOrFalse(0.8)) {
            entity.tree = newTree(0, rand(50, 100));
        }

        entity.pollution = clamp(
            Math.round(((5 * distance) - 5) * randFloat(0.5, 1.0)),
            0,
            MAX_POLLUTION_VALUE,
        );
    }
}