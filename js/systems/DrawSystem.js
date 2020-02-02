import { c } from "../core/canvas.js";
import Color from "../utils/Color.js";
import { clamp } from "../utils/Utils.js";
import * as Mouse from "../core/input/Mouse.js";
import * as Tooltip from "../Tooltip.js";
import * as Img from "../core/Img.js";
import Resources from "../gamelogic/Resources.js";
import Vec2 from "../utils/Vec2.js";
import { NUM_TILES_HEIGHT, NUM_TILES_WIDTH } from "../Entities.js";
import { MAX_POLLUTION_VALUE } from "../gamelogic/MechanicParameters.js";



export const TILE_SIZE = 48;
export const OFFSET_X = 12;
export const OFFSET_Y = 12;



const COLOR_YELLOW = Color.fromHex('#efdb02');
const COLOR_GREY = Color.fromHex('#898989');
const COLOR_BLUE = Color.fromHSL(
            0.53,
            0.51,
            0.46,
);

const COLOR_BROWN = Color.fromHSL(
    0.03,
    0.51,
    0.46,
);

export function applyGround(entity, animationProgress) {

    c.save();
    c.translate(
        entity.position.x * TILE_SIZE,
        entity.position.y * TILE_SIZE,
    );

    let color;
    if (entity.water !== undefined) {
        if (entity.water.level > 0) {
            color = COLOR_BLUE;
        } else {
            color = COLOR_GREY;
        }
    } else if (entity.factory !== undefined) {
        color = COLOR_YELLOW;
    } else {
        const nature = 1.0 - (entity.pollution / MAX_POLLUTION_VALUE);
        color = Color.fromHSL(
            0.15 + (0.135 * nature),
            0.05 + (0.5 * nature),
            0.30 + (0.10 * nature),
        );
    }
    if (entity.display && entity.display.color) {
        color = entity.display.color;
    }

    if (color !== undefined ) {
        c.fillStyle = color.toHex();
        c.fillRect(
            0,
            0,
            TILE_SIZE + (entity.position.x === NUM_TILES_WIDTH - 1 ? 0 : 1),
            TILE_SIZE + (entity.position.y === NUM_TILES_HEIGHT - 1 ? 0 : 1));
    }

    if (entity.water) {
        if(entity.water.output) {
            const direction = entity.water.output.position.subtract(entity.position);
            c.beginPath();
            c.moveTo(24, 24);
            c.lineTo(24 + direction.x * 30, 24 + direction.y * 30);
            c.strokeStyle = "#00f";
            c.lineWidth = 4;
            c.stroke();
        }

    }

    c.restore();
}


export function applyOverlay(entity, animationProgress) {

    c.save();
    c.translate(
        entity.position.x * TILE_SIZE,
        entity.position.y * TILE_SIZE,
    );

    if(entity.item) {
        if (entity.water) {
            let itemFlow = new Vec2(0, 0);
            if(entity.water.output) {
                itemFlow = entity.water.output.position.subtract(entity.position);
                itemFlow = itemFlow.multiply(TILE_SIZE * animationProgress);
            }
            c.fillStyle ="#f00";
            c.fillRect(20 + itemFlow.x, 20 + itemFlow.y, 8, 8);
        } else {
            c.fillStyle ="#f00";
            c.fillRect(20, 20, 8, 8);
        }
    }


    if (Mouse.isOver(
        OFFSET_X + (entity.position.x * TILE_SIZE),
        OFFSET_X + (entity.position.y * TILE_SIZE),
        TILE_SIZE,
        TILE_SIZE,
    )) {
        c.fillStyle ="#fff";
        c.fillRect(0, -1, 50, 2);
        c.fillRect(0, 49, 50, 2);
        c.fillRect(-1, 0, 2, 50);
        c.fillRect(49, 0, 2, 50);

        Tooltip.set(
            `Pollution: ${entity.pollution}\n` +
            `Waterlevel: ${entity.water ? entity.water.level : null}\n` +
            `Treelevel: ${entity.tree ? entity.tree.level : null}\n` +
            `TreeHealth: ${entity.tree ? entity.tree.health : null}\n` +
            `Factory Supply: ${entity.factor ? entity.factor.inputResources[Resources.PINE_WOOD] : null}` +
            ``
        );
    }


    let draw;
    if (entity.tree) {
        draw = drawTree;
    }

    if (draw) {
        draw(entity);
    }

    c.restore();
}


function drawTree(entity) {
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