import Vec2 from "./utils/Vec2.js";
import { rand } from "./utils/Utils.js";
import { newWater } from "./components/Water.js";

export const NUM_TILES_WIDTH = 30;
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

    for (const i of Array(size).keys()) {

        const x =

        entities.add({
            id: i,
            position: new Vec2(
                i % NUM_TILES_WIDTH,
                Math.floor(i/NUM_TILES_WIDTH),
            ),
            pollution: (i % NUM_TILES_WIDTH)  < 3 ? rand(0, 100) : 0,
            pollutionDelta: 0,
        });
    }
    entitiesList = [...entities];

    entitiesList[20 * NUM_TILES_WIDTH + 20].pollution = 100;

    // Water Stuff
    entitiesList[5 * NUM_TILES_WIDTH + 20].water = newWater(true);
    entitiesList[6 * NUM_TILES_WIDTH + 20].water = newWater(false);
    entitiesList[6 * NUM_TILES_WIDTH + 20].water.item = {
        bla : true,
        location: entitiesList[6 * NUM_TILES_WIDTH + 20],
    };

    for (const entity of entities) {
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
