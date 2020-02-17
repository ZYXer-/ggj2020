import { c } from "../core/canvas.js";
import * as Img from "../core/Img.js";


export function drawBuilding(entity) {
    c.save();
    c.translate(24, 24);
    c.scale(0.5, 0.5);
    if (typeof entity.display.buildingSprite !== "undefined") {
        Img.drawSprite("buildings", -96, -96, 192, 192, entity.display.buildingSprite, 0);
    }
    c.restore();
}
