import Vec2 from '../utils/Vec2.js';
import { newWater } from '../components/Water.js';
import { clamp, rand, randFloat, trueOrFalse } from '../utils/Utils.js';
import { newTree } from '../components/Tree.js';
import { MAX_POLLUTION_VALUE } from '../gamelogic/MechanicParameters.js';
import { getTileByCoordinates, NUM_TILES_HEIGHT, NUM_TILES_WIDTH } from '../Entities.js';
import { newPulleyCrane } from '../components/PulleyCrane.js';
import { newItem } from '../components/Item.js';
import Resources from '../gamelogic/Resources.js';


/**
 * Generates a world suited for debugging
 * @param entities
 */
export function generateDebugWorld(entities) {
    const center = new Vec2(
        Math.ceil(NUM_TILES_WIDTH / 2),
        Math.floor(NUM_TILES_HEIGHT / 2),
    );

    getTileByCoordinates(center).water = newWater(true);
    getTileByCoordinates(center).source = true;


    generateRiver(entities, center);
    generateCranes(entities, center);
    generateItems(entities, center);

    // for (const entity of entities) {
    //     const distance = entity.position.subtract(center).norm();
    //
    //     if (distance > 1.5 && distance < 3.5 && trueOrFalse(0.8)) {
    //         entity.tree = newTree(0, rand(50, 100));
    //     }
    //
    //     entity.pollution = clamp(
    //         Math.round(((5 * distance) - 5) * randFloat(0.5, 1.0)),
    //         0,
    //         MAX_POLLUTION_VALUE,
    //     );
    // }
}



function generateRiver(entities, center) {
    let cursor = center.add(new Vec2(0,-1));
    // Move Up
    getTileByCoordinates(cursor).water = newWater();
    cursor = cursor.add(new Vec2(0,-1));
    getTileByCoordinates(cursor).water = newWater();
    cursor = cursor.add(new Vec2(0,-1));
    getTileByCoordinates(cursor).water = newWater();
    cursor = cursor.add(new Vec2(0,-1));
    getTileByCoordinates(cursor).water = newWater();

    // Move Right/Down
    cursor = cursor.add(new Vec2(1,0));
    getTileByCoordinates(cursor).water = newWater();
    cursor = cursor.add(new Vec2(1,0));
    getTileByCoordinates(cursor).water = newWater();
    cursor = cursor.add(new Vec2(0,1));
    getTileByCoordinates(cursor).water = newWater();
    cursor = cursor.add(new Vec2(1,0));
    getTileByCoordinates(cursor).water = newWater();
    cursor = cursor.add(new Vec2(0,1));
    getTileByCoordinates(cursor).water = newWater();
    cursor = cursor.add(new Vec2(0,1));
    getTileByCoordinates(cursor).water = newWater();

    // Move Left
    cursor = cursor.add(new Vec2(-1,0));
    getTileByCoordinates(cursor).water = newWater();
}


function generateCranes(entities, center) {
    let cursor = center.add(new Vec2(1,-3));
    let tile = getTileByCoordinates(cursor);
    tile.display.buildingSprite = 5;
    tile.pulleyCrane = newPulleyCrane(3);

    cursor = center.add(new Vec2(1,-1));
    tile = getTileByCoordinates(cursor);
    tile.display.buildingSprite = 5;
    tile.pulleyCrane = newPulleyCrane(1);
}


function generateItems(entities, center) {
    let cursor = center.add(new Vec2(0,-1));
    let tile = getTileByCoordinates(cursor);
    tile.item = newItem(Resources.PINE_WOOD, tile);

}
