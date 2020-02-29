import { c } from './core/canvas.js';
import * as Keyboard from './core/input/Keyboard.js';
import { BUILDING_TYPES, CURSOR_MODES } from './IngameScene.js';
import * as Img from './core/Img.js';
import { PI } from './utils/GeometryUtils.js';
import { notOccupied } from './CursorActions.js';
import { drawTree } from './tilePainters/treePainter.js';
import { drawBuilding } from './tilePainters/buildingPainter.js';
import { drawPulleyCrane } from './tilePainters/pulleyCranePainter.js';


export function drawToolPreview(entity, animationCountUp, gameState) {

    c.save();
    let mode = gameState.cursorMode;
    if(Keyboard.isPressed(Keyboard.SHIFT)) {
        mode = CURSOR_MODES.PICK;
    }
    switch (mode) {

    case CURSOR_MODES.PICK:
        if(entity.item || entity.tree || entity.factory) {
            c.translate(24, 24);
            c.scale(0.5, 0.5);
            Img.drawSprite('icons', -48, -64 - 32 * Math.abs(Math.sin(PI * animationCountUp)), 96, 96, 0, 3);
            break;
        }

    case CURSOR_MODES.DROP:

        break;

    case CURSOR_MODES.BUILD:

        if(notOccupied(entity)) {
            c.globalAlpha = 0.5;

            switch (gameState.selectedBuildingType) {
            case BUILDING_TYPES.PINE:
                drawTree({ display : entity.display, tree: { type : 0, level : 0, health: 100 }});
                break;
            case BUILDING_TYPES.BEECH:
                drawTree({ display : entity.display, tree: { type : 1, level : 0, health: 100 }});
                break;
            case BUILDING_TYPES.OAK:
                drawTree({ display : entity.display, tree: { type : 2, level : 0, health: 100 }});
                break;
            case BUILDING_TYPES.WATER:
                // TODO
                break;
            case BUILDING_TYPES.TREE_NURSERY:
                drawBuilding({ display: { buildingSprite : 0 } });
                break;
            case BUILDING_TYPES.FORESTER:
                drawBuilding({ display: { buildingSprite : 1 } });
                break;
            case BUILDING_TYPES.LUMBER_HUT:
                drawBuilding({ display: { buildingSprite : 2 } });
                break;
            case BUILDING_TYPES.SPRINKLER:
                drawBuilding({ display: { buildingSprite : 3 } });
                break;
            case BUILDING_TYPES.COMPOST_HEAP:
                drawBuilding({ display: { buildingSprite : 4 } });
                break;
            case BUILDING_TYPES.PULLEY_CRANE:
                drawPulleyCrane({ pulleyCrane: { orientation: gameState.orientation } }, true);
                break;
            }

            c.globalAlpha = 1;
        }
        break;

    case CURSOR_MODES.DESTROY:
        c.translate(24, 24);
        c.scale(0.5, 0.5);
        if(entity.factory || (entity.water && !entity.water.source) || entity.sprinkler || entity.pulleyCrane) {
            Img.drawSprite('icons', -48, -48, 96, 96, 1, 3);
        } else if(entity.tree) {
            Img.drawSprite(
                'icons',
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