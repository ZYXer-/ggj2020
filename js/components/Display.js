import { rand } from "../utils/Utils.js";

export function newDisplay(x, y) {
    return {
        offsetX: x || rand(-8, 8),
        offsetY: y || rand(-32, -16),
    };
}
