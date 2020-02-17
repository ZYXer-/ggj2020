import { c } from "../core/canvas.js";
import Color from "../utils/Color.js";
import * as Mouse from "../core/input/Mouse.js";
import { NUM_TILES_HEIGHT, NUM_TILES_WIDTH } from "../Entities.js";
import { MAX_POLLUTION_VALUE } from "../gamelogic/MechanicParameters.js";
import { setTileTooltip } from "../TooltipController.js";
import { drawBuilding } from "../tilePainters/buildingPainter.js";
import { drawToolPreview } from "../ToolPreview.js";
import { drawTree } from "../tilePainters/treePainter.js";
import { drawItemOnTile } from "../tilePainters/itemPainter.js";
import { drawTileHighlight } from "../tilePainters/tileHighlightPainter.js";
import { drawPulleyCrane } from "../tilePainters/pulleyCranePainter.js";
import { drawWaterAnimation } from "../tilePainters/waterAnimationPainter.js";



export const TILE_SIZE = 48;
export const OFFSET_X = 12;
export const OFFSET_Y = 12;


const COLOR_GREY = Color.fromHex('#898989');
const COLOR_BLUE = Color.fromHSL(0.53, 0.51, 0.46 );


export function applyGround(entity, tickCountUp) {

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
        drawWaterAnimation(entity);

    }

    c.restore();
}


export function applyOverlay(entity, tickCountUp, animationCountUp, gameState) {

    c.save();
    c.translate(
        entity.position.x * TILE_SIZE,
        entity.position.y * TILE_SIZE,
    );

    if(entity.item) {
        drawItemOnTile(entity, tickCountUp);
    }

    let mouseIsOver = Mouse.isOver(
        OFFSET_X + (entity.position.x * TILE_SIZE),
        OFFSET_X + (entity.position.y * TILE_SIZE),
        TILE_SIZE,
        TILE_SIZE,
    );

    if(mouseIsOver) {
        drawTileHighlight(gameState);
    }

    if (entity.factory || entity.sprinkler) {
        drawBuilding(entity);
    }

    if (entity.pulleyCrane) {
        drawPulleyCrane(entity, mouseIsOver);
    }

    if (entity.tree) {
        drawTree(entity);
    }

    if(mouseIsOver) {
        drawToolPreview(entity, animationCountUp, gameState);
        setTileTooltip(entity, gameState);
    }

    c.restore();
}