import { MAX_POLLUTION_VALUE } from '../gamelogic/MechanicParameters.js';
import { NUM_TILES_WIDTH, NUM_TILES_HEIGHT } from '../Entities.js';


export let totalPollution = 0;
export let maxPollution = MAX_POLLUTION_VALUE * NUM_TILES_WIDTH * NUM_TILES_HEIGHT;


export function reset() {
    totalPollution = 0;
}


export function apply(entity) {
    if (entity.pollution) {
        totalPollution += entity.pollution;
    }
}