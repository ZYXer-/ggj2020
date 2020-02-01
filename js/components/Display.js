import { rand } from "../utils/Utils.js";

export function newDisplay(x, y) {
    return {
        offsetX: x || rand(-12, 12),
        offsetY: y || rand(-12, 12),
        randomSprite: rand(0, 3),
    };
}
