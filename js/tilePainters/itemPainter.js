import { c } from '../core/canvas.js';
import * as Img from '../core/Img.js';
import Vec2 from '../utils/Vec2.js';
import { TILE_SIZE } from '../systems/DrawSystem.js';


export function drawItemOnTile(entity, tickCountUp) {
    if (entity.water) {
        let itemFlow = new Vec2(0, 0);
        if(entity.water.output && !entity.water.output.item) {
            itemFlow = entity.water.output.position.subtract(entity.position);
            itemFlow = itemFlow.multiply(TILE_SIZE * tickCountUp);
        }
        drawItem(entity.item, 24 + itemFlow.x, 24 + itemFlow.y);
    } else {
        drawItem(entity.item, 24, 24);
    }
}


export function drawItem(item, x, y) {
    c.save();
    c.translate(x, y);
    c.scale(0.5, 0.5);
    let spriteX = 0;
    if(item.type === 'PineWood') {
        spriteX = 0;
    } else if(item.type === 'BeechWood') {
        spriteX = 1;
    } else if(item.type === 'OakWood') {
        spriteX = 2;
    } else if(item.type === 'PineSapling') {
        spriteX = 3;
    } else if(item.type === 'BeechSapling') {
        spriteX = 4;
    } else if(item.type === 'OakSapling') {
        spriteX = 5;
    } else if(item.type === 'Compost') {
        spriteX = 6;
    }
    Img.drawSprite('items', -16, -16, 32, 32, spriteX, 0);
    c.restore();
}