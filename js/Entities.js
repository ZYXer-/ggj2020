import Vec2 from "./utils/Vec2.js";
import { clamp, rand, randFloat, trueOrFalse } from "./utils/Utils.js";
import { newWater } from "./components/Water.js";
import { newDisplay } from "./components/Display.js";
import { newTree } from "./components/Tree.js";
import { MAX_POLLUTION_VALUE } from "./gamelogic/MechanicParameters.js";

export const NUM_TILES_WIDTH = 33;
export const NUM_TILES_HEIGHT = 22;

export const entities = new Set();
let entitiesList = [];

export function getTileByCoordinates(coordinates) {
    if(coordinates.x >= 0 && coordinates.x < NUM_TILES_WIDTH
        && coordinates.y >= 0 && coordinates.y < NUM_TILES_HEIGHT) {
        return entitiesList[coordinates.y * NUM_TILES_WIDTH + coordinates.x];
    }
    return null;
}

export function generate() {

    const size = NUM_TILES_HEIGHT * NUM_TILES_WIDTH;

    for (const id of Array(size).keys()) {

        let position = new Vec2(
            id % NUM_TILES_WIDTH,
            Math.floor(id / NUM_TILES_WIDTH),
        );

        entities.add({
            id,
            position,
            pollution: 0,
            pollutionDelta: 0,
            item: null,
            itemDelta: {},
            display: newDisplay()
        });
    }

    entitiesList = [...entities];

    for (const entity of entities) {
        entity.hood1 = getHood(1, entity.position, entitiesList);
        entity.hood2 = getHood(2, entity.position, entitiesList);
        entity.hood3 = getHood(3, entity.position, entitiesList);
    }


    // Generate world
    const center = new Vec2(
        Math.ceil(NUM_TILES_WIDTH / 2),
        Math.floor(NUM_TILES_HEIGHT / 2),
    );

    getTileByCoordinates(center).water = newWater(true);
    getTileByCoordinates(center).source = true;

    for (const entity of entities) {
        const distance = entity.position.subtract(center).norm();

        if(distance > 1.5 && distance < 3.5 && trueOrFalse(0.8)) {
            entity.tree = newTree(0, rand(50, 100));
        }

        entity.pollution = clamp(Math.round(((5 * distance) - 5) * randFloat(0.5, 1.0)), 0, MAX_POLLUTION_VALUE);
    }
}

function getHood(range, position, entitiesList) {
    const hood = [];
    for (let x = position.x - range; x <= position.x + range; x++) {
        if (x >= 0 && x < NUM_TILES_WIDTH) {
            for (let y = position.y - range; y <= position.y + range; y++) {
                if (y >= 0 && y < NUM_TILES_HEIGHT) {
                    const manhattanDistance = Math.abs(x - position.x) + Math.abs(y - position.y);
                    if (manhattanDistance <= range) {
                        hood.push(getTileByCoordinates(new Vec2(x, y)));
                    }
                }
            }
        }
    }
    return hood;
}
