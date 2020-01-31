import Vec2 from "./utils/Vec2.js";
import { rand } from "./utils/Utils.js";

export const NUM_TILES_WIDTH = 30;
export const NUM_TILES_HEIGHT = 22;

export const entities = new Set();


export function generate() {

    const size = NUM_TILES_HEIGHT * NUM_TILES_WIDTH;

    for (const i of Array(size).keys()) {
        entities.add({
            id: i,
            position: new Vec2(i % NUM_TILES_WIDTH, Math.floor(i/NUM_TILES_WIDTH)),
            pollution: rand(0, 100),
        });
    }
}
