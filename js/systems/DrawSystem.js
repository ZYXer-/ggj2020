import { c } from "../core/canvas.js";
import Color from "../utils/Color.js";
import * as Mouse from "../core/input/Mouse.js";
import * as Keyboard from "../core/input/Keyboard.js";
import * as Tooltip from "../Tooltip.js";
import * as Img from "../core/Img.js";
import Resources from "../gamelogic/Resources.js";
import Vec2 from "../utils/Vec2.js";
import { NUM_TILES_HEIGHT, NUM_TILES_WIDTH } from "../Entities.js";
import { MAX_POLLUTION_VALUE } from "../gamelogic/MechanicParameters.js";
import {BUILDING_TYPES, CURSOR_MODES } from "../IngameScene.js";
import {HALF_PI, PI } from "../utils/GeometryUtils.js";
import { notOccupied } from "../CursorActions.js";
import {drawCircle} from "../utils/DrawUtils.js";
import {ORIENTATION} from "../gamelogic/Constants.js";



export const TILE_SIZE = 48;
export const OFFSET_X = 12;
export const OFFSET_Y = 12;


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
            if(entity.water.output && !entity.water.output.item) {
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

    if (entity.factory || entity.sprinkler || entity.pulleyCrane) {
        drawBuilding(entity, isOver);
    }

    if (entity.tree) {
        drawTree(entity);
    }

    if(isOver) {
        drawToolPreview(entity, animationCountUp, gameState);

        let tooltip = "full///";
        if(entity.tree) {
            if(entity.tree.type === 0) {
                tooltip += "Pine Tree///";
            } else if(entity.tree.type === 1) {
                tooltip += "Beech Tree///";
            } else if(entity.tree.type === 2) {
                tooltip += "Oak Tree///";
            }
            tooltip += "Growth: " + Math.round(entity.tree.level) + "%///";
            tooltip += "Health: " + Math.round(entity.tree.health) + "%///";
            tooltip += "Pollution: " + Math.round(entity.pollution) + "%///";
            if(Keyboard.isPressed(Keyboard.SHIFT) || gameState.cursorMode === CURSOR_MODES.DESTROY || gameState.cursorMode === CURSOR_MODES.PICK) {
                tooltip += "$$$Click to chop down";
            }

        } else if(entity.water) {
            if(entity.water.source) {
                tooltip += "Natural Water Spring///";
                tooltip += "Source of all life///";
                tooltip += "$$$(Cannot be demolished)";
            } else {
                tooltip += "Water Canal///";
                tooltip += "Water level: " + Math.round(entity.water.level) + "%///";
                tooltip += "Pollution: " + Math.round(entity.pollution) + "%///";
                if(gameState.cursorMode === CURSOR_MODES.DESTROY) {
                    tooltip += "$$$Click to demolish";
                }
            }
            if(Keyboard.isPressed(Keyboard.SHIFT) || gameState.cursorMode === CURSOR_MODES.PICK) {
                tooltip += "$$$Click to pick up resources";// TODO make differentiation between resources
            } else if(gameState.cursorMode === CURSOR_MODES.DROP) {
                tooltip += "$$$Click to drop item"; // TODO make differentiation between items
            }

        } else if(entity.pulleyCrane) {
            tooltip += "Pulley Crane///";
            if(entity.pulleyCrane.orientation === ORIENTATION.NORTH_SOUTH) {
                tooltip += "Moves items North to South///";
            } else if(entity.pulleyCrane.orientation === ORIENTATION.EAST_WEST) {
                tooltip += "Moves items East to West///";
            } else if(entity.pulleyCrane.orientation === ORIENTATION.SOUTH_NORTH) {
                tooltip += "Moves items South to North///";
            } else if(entity.pulleyCrane.orientation === ORIENTATION.WEST_EAST) {
                tooltip += "Moves items West to East///";
            }
            tooltip += "Pollution: " + Math.round(entity.pollution) + "%///";

            if(Keyboard.isPressed(Keyboard.SHIFT) || gameState.cursorMode === CURSOR_MODES.PICK) {
                tooltip += "$$$Click to pick up resources";// TODO make differentiation between resources
            } else if(gameState.cursorMode === CURSOR_MODES.DESTROY) {
                tooltip += "$$$Click to demolish";
            }

        } else if(entity.sprinkler) {
            tooltip += "Sprinkler///";
            tooltip += "Pollution: " + Math.round(entity.pollution) + "%///";
            if(Keyboard.isPressed(Keyboard.SHIFT) || gameState.cursorMode === CURSOR_MODES.DESTROY) {
                tooltip += "$$$Click to demolish";
            }

        } else if(entity.factory) {
            if(entity.treeNursery) {
                tooltip += "Tree Nursery///";
                // TODO: Explain what it does
            } else if(entity.forester) {
                tooltip += "Forester///";
                // TODO: Explain what it does
            } else if(entity.lumberHut) {
                tooltip += "Log Cabin///";
                // TODO: Explain what it does
            } else if(entity.compost) {
                tooltip += "Compost///";
                // TODO: Explain what it does
            }

            const resourceNames = {
                [Resources.PINE_WOOD]: " pine wood",
                [Resources.BEECH_WOOD]: " beech wood",
                [Resources.OAK_WOOD]: " oak wood",
                [Resources.PINE_SAPLING]: " pine sapling",
                [Resources.BEECH_SAPLING]: " beech sapling",
                [Resources.OAK_SAPLING]: " oak sapling",
                [Resources.COMPOST]: " fertilizer",
            };

            let inputTooltip = "";
            let first = true;
            for(let res in resourceNames) {
                if(typeof entity.factory.requiredResources[res] !== "undefined" && entity.factory.requiredResources[res] > 0) {
                    if(!first) {
                        inputTooltip += ", ";
                    }
                    if(entity.factory.inputResources[res]) {
                        inputTooltip += entity.factory.inputResources[res] + resourceNames[res];
                    } else {
                        inputTooltip += "0" + resourceNames[res];
                    }
                    first = false;
                }
            }
            if(inputTooltip !== "") {
                tooltip += "Input: " + inputTooltip + "///";
            }

            let outputTooltip = "";
            first = true;
            for(let res in resourceNames) {
                if(entity.factory.producedResource === res) {
                    if(!first) {
                        outputTooltip += ", ";
                    }
                    if(entity.factory.outputResources[res]) {
                        outputTooltip += entity.factory.outputResources[res] + resourceNames[res];
                    } else {
                        outputTooltip += "0" + resourceNames[res];
                    }
                    first = false;
                }
            }
            if(outputTooltip !== "") {
                tooltip += "Output: " + outputTooltip + "///";
            }

            tooltip += "Pollution: " + Math.round(entity.pollution) + "%///";
            if(Keyboard.isPressed(Keyboard.SHIFT) || gameState.cursorMode === CURSOR_MODES.PICK) {
                tooltip += "$$$Click to pick up resources";// TODO make differentiation between resources
            } else if(gameState.cursorMode === CURSOR_MODES.DESTROY) {
                tooltip += "$$$Click to demolish";
            } else if(gameState.cursorMode === CURSOR_MODES.DROP) {
                tooltip += "$$$Click to drop item"; // TODO make differentiation between items
            }

        } else {
            tooltip += "Barren Land///";
            tooltip += "Pollution: " + Math.round(entity.pollution) + "%///";
            if(Keyboard.isPressed(Keyboard.SHIFT) || gameState.cursorMode === CURSOR_MODES.PICK) {
                tooltip += "$$$Click to pick up resources";// TODO make differentiation between resources
            } else if(gameState.cursorMode === CURSOR_MODES.BUILD) {
                tooltip += "$$$Click to build building"; // TODO make differentiation between buildings
            }
        }

        Tooltip.set(tooltip);

        /*Tooltip.set(
            `Pollution: ${entity.pollution}\n` +
            `Waterlevel: ${entity.water ? entity.water.level : null}\n` +
            `Treelevel: ${entity.tree ? entity.tree.level : null}\n` +
            `TreeHealth: ${entity.tree ? entity.tree.health : null}\n` +
            `Factory Supply: ${entity.factor ? entity.factor.inputResources[Resources.PINE_WOOD] : null}` +
            ``
        );*/
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


function drawBuilding(entity, hover) {
    c.save();
    c.translate(24, 24);
    c.scale(0.5, 0.5);
    if (typeof entity.display.buildingSprite !== "undefined") {
        if(entity.pulleyCrane) {
            drawPulleyCrane(entity, hover);
        } else {
            Img.drawSprite("buildings", -96, -96, 192, 192, entity.display.buildingSprite, 0);

        }
    }
    c.restore();
}


function drawPulleyCrane(entity, hover) {
    c.rotate(HALF_PI * (entity.pulleyCrane.orientation + 1));
    Img.drawSprite("buildings", -96, -96, 192, 192, 5, 0);
    if(hover) {
        c.globalAlpha = 1;
        c.strokeStyle = "#fff";
        c.lineWidth = 5;
        drawCircle(c, -96, 0, 12);
        c.stroke();

        c.fillStyle = "#fff";
        c.beginPath();
        c.moveTo(-70, -4);
        c.lineTo(64, -4);
        c.lineTo(64, -12);
        c.lineTo(76, 0);
        c.lineTo(64, 12);
        c.lineTo(64, 4);
        c.lineTo(-70, 4);
        c.fill();

        drawCircle(c, 96, 0, 8);
        c.fill();

    }
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
    let mode = gameState.cursorMode;
    if(Keyboard.isPressed(Keyboard.SHIFT)) {
        mode = CURSOR_MODES.PICK;
    }
    switch (mode) {

        case CURSOR_MODES.PICK:
            if(entity.item || entity.tree || entity.factory) {
                c.translate(24, 24);
                c.scale(0.5, 0.5);
                Img.drawSprite("icons", -48, -64 - 32 * Math.abs(Math.sin(PI * animationCountUp)), 96, 96, 0, 3);
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
                        drawBuilding({ display: { buildingSprite : 0 } }, true);
                        break;
                    case BUILDING_TYPES.FORESTER:
                        drawBuilding({ display: { buildingSprite : 1 } }, true);
                        break;
                    case BUILDING_TYPES.LOG_CABIN:
                        drawBuilding({ display: { buildingSprite : 2 } }, true);
                        break;
                    case BUILDING_TYPES.SPRINKLER:
                        drawBuilding({ display: { buildingSprite : 3 } }, true);
                        break;
                    case BUILDING_TYPES.COMPOST_HEAP:
                        drawBuilding({ display: { buildingSprite : 4 } }, true);
                        break;
                    case BUILDING_TYPES.PULLEY_CRANE:
                        drawBuilding({ display: { buildingSprite : 5 }, pulleyCrane: { orientation: gameState.orientation } }, true);
                        break;
                }

                c.globalAlpha = 1;
            }
            break;

        case CURSOR_MODES.DESTROY:
            c.translate(24, 24);
            c.scale(0.5, 0.5);
            if(entity.factory || (entity.water && !entity.water.source) || entity.sprinkler || entity.pulleyCrane) {
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