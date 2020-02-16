import Text from "./utils/Text.js";
import * as Img from "./core/Img.js";
import * as PollutionApplicationSystem from "./systems/PollutionApplicationSystem.js";
import Button from "./utils/Button.js";
import {c} from "./core/canvas.js";
import Color from "./utils/Color.js";
import * as TotalPollutionCounterSystem from "./systems/TotalPollutionCounterSystem.js";
import Resources from "./gamelogic/Resources.js";
import { GameState, BUILDING_TYPES, CURSOR_MODES } from "./IngameScene.js";
import {drawRoundedCornerRect} from "./utils/DrawUtils.js";


let progressNumber = new Text({
    x: 165,
    y: 170,
    size : 24,
    font : "norwester",
    align : "right",
    color : "#ccc",
    verticalAlign: "center",
    borderWidth : 2,
    borderColor : "rgba(0, 0, 0, 0.2)",
    monospaced: 12
});

let progressPercent = new Text({
    x: 164,
    y: 170,
    size : 24,
    font : "norwester",
    align : "left",
    color : "#ccc",
    verticalAlign: "center",
    borderWidth : 2,
    borderColor : "rgba(0, 0, 0, 0.2)",
});


let labelText = new Text({
    size : 16,
    font : "norwester",
    color : "#ccc"
});

let numberText = new Text({
    x: 165,
    y: 170,
    size : 16,
    font : "norwester",
    align : "right",
    color : "#ccc",
    monospaced: 8
});

let centerText = new Text({
    size : 16,
    font : "norwester",
    align : "center",
    color : "#ccc"
});

let activeText = new Text({
    size : 16,
    font : "norwester",
    align : "center",
    color : "#222"
});

let items = [
    {
        offset: 0,
        item: 3,
        label: "Pine Sapling",
        value: Resources.PINE_SAPLING,
    },
    {
        offset: 0,
        item: 4,
        label: "Beech Sapling",
        value: Resources.BEECH_SAPLING,
    },
    {
        offset: 0,
        item: 5,
        label: "Oak Sapling",
        value: Resources.OAK_SAPLING,
    },
    {
        offset: 8,
        item: 0,
        label: "Pine Wood",
        value: Resources.PINE_WOOD,
    },
    {
        offset: 8,
        item: 1,
        label: "Beech Wood",
        value: Resources.BEECH_WOOD,
    },
    {
        offset: 8,
        item: 2,
        label: "Oak Wood",
        value: Resources.OAK_WOOD,
    },
    {
        offset: 16,
        item: 6,
        label: "Fertilizer",
        value: Resources.COMPOST,
    },
];

function resourceTypeToBuildingType(resourceType) {
    switch (resourceType) {
        case(Resources.PINE_SAPLING):
            return BUILDING_TYPES.PINE;
        case(Resources.BEECH_SAPLING):
            return BUILDING_TYPES.BEECH;
        case(Resources.OAK_SAPLING):
            return BUILDING_TYPES.OAK;
        default:
            console.error("Not Supported!");
    }
}

function buildingTypeToResourceType(buildingType) {
    switch (buildingType) {
        case(BUILDING_TYPES.PINE):
            return Resources.PINE_SAPLING;
        case(BUILDING_TYPES.BEECH):
            return Resources.BEECH_SAPLING;
        case(BUILDING_TYPES.OAK):
            return Resources.OAK_SAPLING;
        default:
            return null;
    }
}

for(let itemIndex in items) {
    const item = items[itemIndex];
    item.dispenseButton = new Button({
        x : 1596 + 182,
        y : 314 + (28 * itemIndex) + item.offset,
        w : 68,
        h : 20,
        click() {
            GameState.cursorMode = CURSOR_MODES.DROP;
            GameState.selectedResource = item.value;
        },
        draw(x, y, w, h, isOver, down) {
            c.fillStyle = "#ccc";
            if(isOver) {
                c.fillStyle = "#fff";
                if(down) {
                    y += 2;
                }
            }
            if(GameState.cursorMode === CURSOR_MODES.DROP && GameState.selectedResource === item.value) {
                c.fillStyle = "#58b001";
            }
            c.fillRect(x, y, w, h);
            activeText.drawPosText(x + 0.5 * w, y + 16, "dispense");
        }
    });
    if(itemIndex < 3) {
        item.plantButton = new Button({
            x : 1596 + 254,
            y : 314 + (28 * itemIndex) + item.offset,
            w : 48,
            h : 20,
            click() {
                GameState.cursorMode = CURSOR_MODES.BUILD;
                GameState.selectedBuildingType = resourceTypeToBuildingType(item.value);
            },
            draw(x, y, w, h, isOver, down) {
                c.fillStyle = "#ccc";
                if(isOver) {
                    c.fillStyle = "#fff";
                    if(down) {
                        y += 2;
                    }
                }
                if(GameState.cursorMode === CURSOR_MODES.BUILD && item.value === buildingTypeToResourceType(GameState.selectedBuildingType)) {
                    c.fillStyle = "#58b001";
                }
                c.fillRect(x, y, w, h);
                activeText.drawPosText(x + 0.5 * w, y + 16, "plant");
            }
        });
    }
}


let buildings = [
    {
        offset: 0,
        icon: 0,
        label: "Pick up",
        click() {
            GameState.cursorMode = CURSOR_MODES.PICK;
        },
        isActive() {
            return GameState.cursorMode === CURSOR_MODES.PICK;
        },
    },
    {
        offset: 0,
        icon: 1,
        label: "Demolish",
        click() {
            GameState.cursorMode = CURSOR_MODES.DESTROY;
        },
        isActive() {
            return GameState.cursorMode === CURSOR_MODES.DESTROY;
        },
    },
    {
        offset: 22,
        buildingSprite: 5,
        buildingSpriteOffsetY: 36,
        label: "Pulley Crane",
        click() {
            console.log("pulley crane");
        },
        isActive() {
            return false;
        },
    },
    {
        offset: 22,
        label: "Canal",
        click() {
            GameState.cursorMode = CURSOR_MODES.BUILD;
            GameState.selectedBuildingType = BUILDING_TYPES.WATER;
        },
        isActive() {
            return GameState.cursorMode === CURSOR_MODES.BUILD
                && GameState.selectedBuildingType === BUILDING_TYPES.WATER;
        },
    },
    {
        offset: 22,
        buildingSprite: 0,
        buildingSpriteOffsetY: 36,
        label: "Tree Nursery",
        click() {
            GameState.cursorMode = CURSOR_MODES.BUILD;
            GameState.selectedBuildingType = BUILDING_TYPES.TREE_NURSERY;
        },
        isActive() {
            return GameState.cursorMode === CURSOR_MODES.BUILD
                && GameState.selectedBuildingType === BUILDING_TYPES.TREE_NURSERY;
        },
    },
    {
        offset: 22,
        buildingSprite: 1,
        buildingSpriteOffsetY: 48,
        label: "Forester",
        click() {
            GameState.cursorMode = CURSOR_MODES.BUILD;
            GameState.selectedBuildingType = BUILDING_TYPES.FORESTER;
        },
        isActive() {
            return GameState.cursorMode === CURSOR_MODES.BUILD
                && GameState.selectedBuildingType === BUILDING_TYPES.FORESTER;
        },
    },
    {
        offset: 22,
        buildingSprite: 2,
        buildingSpriteOffsetY: 48,
        label: "Log Cabin",
        click() {
            GameState.cursorMode = CURSOR_MODES.BUILD;
            GameState.selectedBuildingType = BUILDING_TYPES.LOG_CABIN;
        },
        isActive() {
            return GameState.cursorMode === CURSOR_MODES.BUILD
                && GameState.selectedBuildingType === BUILDING_TYPES.LOG_CABIN;
        },
    },
    {
        offset: 22,
        buildingSprite: 3,
        buildingSpriteOffsetY: 40,
        label: "Sprinkler",
        click() {
            GameState.cursorMode = CURSOR_MODES.BUILD;
            GameState.selectedBuildingType = BUILDING_TYPES.SPRINKLER;
        },
        isActive() {
            return GameState.cursorMode === CURSOR_MODES.BUILD
                && GameState.selectedBuildingType === BUILDING_TYPES.SPRINKLER;
        },

    },
    {
        offset: 22,
        buildingSprite: 4,
        buildingSpriteOffsetY: 40,
        label: "Compost Heap",
        click() {
            GameState.cursorMode = CURSOR_MODES.BUILD;
            GameState.selectedBuildingType = BUILDING_TYPES.COMPOST_HEAP;
        },
        isActive() {
            return GameState.cursorMode === CURSOR_MODES.BUILD
                && GameState.selectedBuildingType === BUILDING_TYPES.COMPOST_HEAP;
        },
    },
];

for(let buildingIndex in buildings) {
    const building = buildings[buildingIndex];
    building.buildButton = new Button({
        x : 1596 + (buildingIndex % 2 === 0 ? 20 : 165),
        y : 552 + (98 * Math.floor(buildingIndex * 0.5)) + building.offset,
        w : 137,
        h : 90,
        click() {
            building.click();
        },
        draw(x, y, w, h, isOver, down) {
            c.fillStyle = "#ccc";
            let iconSpriteY = 0;
            if(isOver) {
                c.fillStyle = "#fff";
                iconSpriteY = 1;
                if(down) {
                    y += 2;
                }
            }
            if(building.isActive()) {
                c.fillStyle = "#fff";
                iconSpriteY = 2;
            }
            drawRoundedCornerRect(x, y, w, h, 4);
            c.fill();
            if(iconSpriteY < 2) {
                c.fillStyle = "#222";
                drawRoundedCornerRect(x + 2, y + 2, w - 4, h - 4, 2);
                c.fill();
            }

            if(typeof building.icon !== "undefined") {
                c.save();
                c.translate(x + (0.5 * w), y + 36);
                c.scale(0.5, 0.5);
                Img.drawSprite("icons", -48, -48, 96, 96, building.icon, iconSpriteY);
                c.restore();
            }

            if(typeof building.buildingSprite !== "undefined") {
                c.save();
                c.translate(x + (0.5 * w), y + building.buildingSpriteOffsetY);
                c.scale(0.5, 0.5);
                Img.drawSprite("buildings", -96, -96, 192, 192, building.buildingSprite, 0);
                c.restore();
            }

            if(iconSpriteY < 2) {
                centerText.drawPosText(x + 0.5 * w, y + 80, building.label);
            } else {
                activeText.drawPosText(x + 0.5 * w, y + 80, building.label);
            }
        }
    });
}


export function update(gameState) {

}


function getText(gameState) {
    let text = '';
    for (let [key, value] of Object.entries(gameState)) {
        text += `${key}: ${value.name ? value.name : value}\n`;
    }
    return text;
}

export function draw(gameState) {

    c.save();
    c.translate(1596, 0);

    const progress = 1.0 - (TotalPollutionCounterSystem.totalPollution / TotalPollutionCounterSystem.maxPollution);

    let progressColor = Color.fromHSL(
        0.25,
        0.001 + (0.99 * progress),
        0.185 + (0.16 * progress),
    );

    c.fillStyle = progressColor.toHex();
    c.fillRect(61, 261 - (progress * 200), 200, progress * 200);

    c.save();
    c.scale(0.5, 0.5);
    Img.draw("panel", 0, 0);
    c.restore();

    progressPercent.drawText("%");
    progressNumber.drawText(Math.round(progress * 100).toString());

    for(let itemIndex in items) {
        const item = items[itemIndex];
        c.save();
        c.translate(20, 316 + (28 * itemIndex) + item.offset);

        c.save();
        c.scale(0.5, 0.5);
        Img.drawSprite("items", 0, 0, 32, 32, item.item, 0);
        c.restore();

        labelText.drawPosText(24, 14, item.label);
        numberText.drawPosText(152, 14, Math.round(gameState[item.value]).toString(10));

        c.restore();
    }

    c.restore();

    for(let itemIndex in items) {
        const item = items[itemIndex];
        item.dispenseButton.draw();
        if(itemIndex < 3) {
            item.plantButton.draw();
        }
    }

    for(let buildingIndex in buildings) {
        const building = buildings[buildingIndex];
        building.buildButton.draw();
    }
}