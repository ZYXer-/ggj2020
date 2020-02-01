import { c } from "../core/canvas.js";
import Color from "../utils/Color.js";
import { clamp } from "../utils/Utils.js";
import * as Mouse from "../core/input/Mouse.js";
import * as Tooltip from "../Tooltip.js";
import * as Img from "../core/Img.js";
import Resources from "../gamelogic/Resources.js";

export const TILE_SIZE = 48;
export const SPRITE_SIZE = 48;


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

export function apply(entity) {
    c.save();

    c.translate(
        entity.position.x * TILE_SIZE,
        entity.position.y * TILE_SIZE,
    );

    let color;
    let draw;
    if (entity.tree) {
        draw = drawTree;
        color = COLOR_BROWN;
    } else if (entity.water !== undefined) {
        if (entity.water.level > 2) {
            color = COLOR_BLUE;
        } else {
            color = COLOR_GREY;
        }
    } else if (entity.factory !== undefined) {
        color = COLOR_YELLOW;
    } else {
       color = Color.fromHSL(
            0.45,
            clamp(1 - entity.pollution/100, 0.001, 1),
            0.37,
        );
    }

    if (color !== undefined) {
        c.fillStyle = color.toHex();
        c.fillRect(0,0, TILE_SIZE + 1, TILE_SIZE + 1);
    }
    if (draw) {
        draw(entity);
    }

    c.restore();

    if (Mouse.isOver(
        entity.position.x * TILE_SIZE,
        entity.position.y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
    )) {
        Tooltip.set(
            `Pollution: ${entity.pollution}\n` +
            `Waterlevel: ${entity.water ? entity.water.level : null}\n` +
            `Treelevel: ${entity.tree ? entity.tree.level : null}\n` +
            `Factory Supply: ${entity.factor ? entity.factor.inputResources[Resources.PINE_WOOD] : null}` +
            ``
        );
    }
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
    let treeImageId;
    if (entity.tree.level < 20) {
        treeImageId = 0;
    } else if (entity.tree.level < 40) {
        treeImageId = 0;
    } else if (entity.tree.level < 60) {
        treeImageId = 1;
    } else if (entity.tree.level < 80) {
        treeImageId = 2;
    } else if (entity.tree.level < 100) {
        treeImageId = 3;
    } else {
        treeImageId = 4;
    }
    Img.drawSprite(
        'trees',
        0,
        0,
        2* TILE_SIZE,
        120,
        treeImageId,
        0,
    );
    c.restore();
}