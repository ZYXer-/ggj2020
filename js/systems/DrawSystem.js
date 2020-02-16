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
import {BUILDING_TYPES, CURSOR_MODES, GameState} from "../IngameScene.js";
import { PI, TWO_PI } from "../utils/GeometryUtils.js";
import * as CursorActions from "../CursorActions.js";



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
    } else {
        const nature = 1.0 - (entity.pollution / MAX_POLLUTION_VALUE);
        color = Color.fromHSL(
            0.15 + (0.135 * nature),
            0.05 + (0.5 * nature),
            0.30 + (0.10 * nature),
        );
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
            c.lineTo(24 + direction.x * 20, 24 + direction.y * 20);
            c.strokeStyle = "#00f";
            c.lineWidth = 4;
            c.stroke();
            let rotation = direction.angle();
            c.save();
            c.translate(24, 24);
            c.rotate(-rotation);
            c.fillStyle = "#00f";
            c.beginPath();
            c.moveTo(0, 24);
            c.lineTo(10, 14);
            c.lineTo(-10, 14);
            c.closePath();
            c.fill();
            c.restore();
        }

    }

    c.restore();
}


export function applyOverlay(entity, animationProgress, animationCountUp, gameState) {

    c.save();
    c.translate(
        entity.position.x * TILE_SIZE,
        entity.position.y * TILE_SIZE,
    );

    if(entity.item) {
        if (entity.water) {
            let itemFlow = new Vec2(0, 0);
            if(entity.water.output && entity.water.output.item === null) {
                itemFlow = entity.water.output.position.subtract(entity.position);
                itemFlow = itemFlow.multiply(TILE_SIZE * animationProgress);
            }
            drawItem(entity.item, 24 + itemFlow.x, 24 + itemFlow.y);
        } else {
            drawItem(entity.item, 24, 24);
        }
    }

    let isOver = false;
    if (Mouse.isOver(
        OFFSET_X + (entity.position.x * TILE_SIZE),
        OFFSET_X + (entity.position.y * TILE_SIZE),
        TILE_SIZE,
        TILE_SIZE,
    )) {
        c.fillStyle = "#fff";
        if(gameState.cursorMode === CURSOR_MODES.DESTROY) {
            c.fillStyle = "#d00";
        }
        c.fillRect(0, -1, 48, 2);
        c.fillRect(0, 47, 48, 2);
        c.fillRect(-1, 0, 2, 48);
        c.fillRect(47, 0, 2, 48);

        isOver = true;
    }


    let draw;
    if (entity.factory || entity.sprinkler || entity.pulleyCrane) {
        draw = drawBuilding;
    }

    if (entity.tree) {
        draw = drawTree;
    }

    if (draw) {
        draw(entity);
    }

    if(isOver) {
        drawToolPreview(entity, animationCountUp, gameState);

        Tooltip.set(
            `Pollution: ${entity.pollution}\n` +
            `Waterlevel: ${entity.water ? entity.water.level : null}\n` +
            `Treelevel: ${entity.tree ? entity.tree.level : null}\n` +
            `TreeHealth: ${entity.tree ? entity.tree.health : null}\n` +
            `Factory Supply: ${entity.factor ? entity.factor.inputResources[Resources.PINE_WOOD] : null}` +
            ``
        );
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


function drawBuilding(entity) {
    c.save();
    c.translate(24, 24);
    c.scale(0.5, 0.5);
    if (typeof entity.display.buildingSprite !== "undefined") {
        Img.drawSprite("buildings", -96, -96, 192, 192, entity.display.buildingSprite, 0);
    }
    c.restore();
}


function drawItem(item, x, y) {
    c.save();
    c.translate(x, y);
    c.scale(0.5, 0.5);
    let spriteX = 0;
    if(item.type === "PineWood") {
        spriteX = 0;
    } else if(item.type === "BeechWood") {
        spriteX = 1;
    } else if(item.type === "OakWood") {
        spriteX = 2;
    } else if(item.type === "PineSapling") {
        spriteX = 3;
    } else if(item.type === "BeechSapling") {
        spriteX = 4;
    } else if(item.type === "OakSapling") {
        spriteX = 5;
    } else if(item.type === "Compost") {
        spriteX = 6;
    }
    Img.drawSprite("items", -16, -16, 32, 32, spriteX, 0);
    c.restore();
}


function drawToolPreview(entity, animationCountUp, gameState) {
    c.save();
    switch (gameState.cursorMode) {

        case CURSOR_MODES.PICK:
            c.translate(24, 24);
            c.scale(0.5, 0.5);
            Img.drawSprite("icons", -48, -64 - 32 * Math.abs(Math.sin(PI * animationCountUp)), 96, 96, 0, 3);
            break;

        case CURSOR_MODES.DROP:

            break;

        case CURSOR_MODES.BUILD:
            c.globalAlpha = 0.5;

            switch (gameState.selectedBuildingType) {
                case BUILDING_TYPES.PINE:
                    //drawTree({});
                    break;
                case BUILDING_TYPES.BEECH:
                    //drawTree({});
                    break;
                case BUILDING_TYPES.OAK:
                    //CursorActions.PlaceTree(gameState, Resources.OAK_SAPLING);
                    break;
                case BUILDING_TYPES.WATER:
                    //CursorActions.PlaceWater(gameState);
                    break;
                case BUILDING_TYPES.TREE_NURSERY:
                    //CursorActions.PlaceTreeNursery(gameState);
                    break;
                case BUILDING_TYPES.FORESTER:
                    //CursorActions.PlaceForester(gameState);
                    break;
                case BUILDING_TYPES.LOG_CABIN:
                    //CursorActions.PlaceLogCabin(gameState);
                    break;
                case BUILDING_TYPES.SPRINKLER:
                    //CursorActions.PlaceSprinkler(gameState);
                    break;
                case BUILDING_TYPES.COMPOST_HEAP:
                    //CursorActions.PlaceCompostHeap(gameState);
                    break;
            }

            c.globalAlpha = 1;
            break;

        case CURSOR_MODES.DESTROY:
            c.translate(24, 24);
            c.scale(0.5, 0.5);
            if(entity.factory || entity.water || entity.sprinkler) {
                Img.drawSprite("icons", -48, -48, 96, 96, 1, 3);
            } else if(entity.tree) {
                Img.drawSprite(
                    "icons",
                    -48 + (2 * entity.display.offsetX),
                    -62 + (2 * entity.display.offsetY) - (0.2 * entity.tree.level),
                    96,
                    96,
                    1,
                    3
                );
            }

            break;
    }
    c.restore();
}