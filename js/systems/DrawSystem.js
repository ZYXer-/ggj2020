import { c } from "../core/canvas.js";
import Color from "../utils/Color.js";
import { clamp } from "../utils/Utils.js";

const TILE_SIZE = 48;


export function apply(entity) {
    c.save();

    c.translate(
        entity.position.x * TILE_SIZE,
        entity.position.y * TILE_SIZE,
    );
    const color = Color.fromHSL(
        0.45,
        clamp(entity.pollution/100, 0.001, 1),
        0.37,
        );

    c.fillStyle = color.toHex();
    c.fillRect(0,0, TILE_SIZE + 1, TILE_SIZE + 1);

    c.restore();
}