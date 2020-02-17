import { c } from "../core/canvas.js";
import * as Img from "../core/Img.js";
import { TILE_SIZE } from "../systems/DrawSystem.js";


export function drawTree(entity) {

    c.save();
    if (entity.display) {
        c.translate(
            entity.display.offsetX,
            entity.display.offsetY,
        )
    }
    c.scale(0.5, 0.5);
    if(entity.tree.level < 20 && entity.tree.health > 0) {
        Img.drawSprite(
            "items",
            33,
            18,
            32,
            32,
            3 + entity.tree.type,
            0,
        );

    } else {
        let spriteX = entity.tree.type * 5;
        if (entity.tree.level < 40) {
            spriteX += 0;
        } else if (entity.tree.level < 60) {
            spriteX += 1;
        } else if (entity.tree.level < 80) {
            spriteX += 2;
        } else if (entity.tree.level < 100) {
            spriteX += 3;
        } else {
            spriteX += 4;
        }
        let spriteY = entity.display.randomSprite;
        if(entity.tree.type === 2) {
            spriteY = 0;
        }
        if(entity.tree.health === 0) {
            spriteY += 4;
        }
        Img.drawSprite(
            "trees",
            0,
            -48,
            2 * TILE_SIZE,
            120,
            spriteX,
            spriteY,
        );
    }

    c.restore();
}