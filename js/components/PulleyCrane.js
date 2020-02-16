import {ORIENTATION} from "../gamelogic/Constants.js";

export const PULLEY_CRANE_STATUS = {
   READY: 0,
   LOADED: 10,
   REWIND: 20,
};

export function newPulleyCrane(orientation) {
    return {
        status: PULLEY_CRANE_STATUS.READY,
        orientation: orientation || ORIENTATION.NORTH_SOUTH,
        item: null,
    };
}
