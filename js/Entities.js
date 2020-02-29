import Vec2 from './utils/Vec2.js';
import {newDisplay} from './components/Display.js';
import {generateWorld} from './worldGenerator/WorldGenerator.js';
import { Game } from './Settings.js';
import { generateDebugWorld } from './worldGenerator/DebugWorldGenerator.js';

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

    precomputedHood(entities);


    // Generate world
    if (Game.DEBUG) {
        generateDebugWorld(entities);
    } else {
        generateWorld(entities);
    }
}

function precomputedHood(_entities) {
    for (const entity of _entities) {
        entity.hood1 = getHood(1, entity.position, entitiesList);
        entity.hood2 = getHood(2, entity.position, entitiesList);
        entity.hood3 = getHood(3, entity.position, entitiesList);
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
