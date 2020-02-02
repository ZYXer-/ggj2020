import Text from "./utils/Text.js";
import * as Img from "./core/Img.js";
import * as PollutionApplicationSystem from "./systems/PollutionApplicationSystem.js";
import Button from "./utils/Button.js";
import {c} from "./core/canvas.js";
import Color from "./utils/Color.js";
import * as TotalPollutionCounterSystem from "./systems/TotalPollutionCounterSystem.js";
import Resources from "./gamelogic/Resources.js";
import { GameState, BUILDING_TYPES, CURSOR_MODES } from "./IngameScene.js";


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

let highlightedText = new Text({
    size : 16,
    font : "norwester",
    align : "center",
    color : "#fff"
});

let selectedText = new Text({
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
            console.error("Not Supported!");
    }
}

for(let itemIndex in items) {
    const item = items[itemIndex];
    item.dispenseButton = new Button({
        x : 1596 + 182,
        y : 318 + (28 * itemIndex) + item.offset,
        w : 68,
        h : 20,
        click() {
            console.log("DISPENSE=" + item.value);
        },
        draw(x, y, w, h, isOver, down) {
            c.fillStyle = "#ccc";
            if(isOver) {
                c.fillStyle = "#fff";
                if(down) {
                    y += 2;
                }
            }
            if(false /* TODO: if selected */) {
                c.fillStyle = "#58b001";
            }
            c.fillRect(x, y, w, h);
            selectedText.drawPosText(x + 0.5 * w, y + 16, "dispense");
        }
    });
    if(itemIndex < 3) {
        item.plantButton = new Button({
            x : 1596 + 254,
            y : 318 + (28 * itemIndex) + item.offset,
            w : 48,
            h : 20,
            click() {
                GameState.cursorMode = CURSOR_MODES.BUILD;
                GameState.selectedBuildingType = resourceTypeToBuildingType(item.value);
                console.log("PLANT=" + item.value);
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
                selectedText.drawPosText(x + 0.5 * w, y + 16, "plant");
            }
        });
    }
}

let text = new Text({
    size : 14,
    font : "norwester",
    // align : "right",
    color : "#ccc",
    // borderWidth : 5,
    // borderColor : "#000",
    // maxWidth : 250,
    // lineHeight : 50,
    verticalAlign : "top",
    // letterSpacing : 3,
    // appearCharPerSec : 10,
    // monospaced : 25,
});

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
        c.translate(20, 320 + (28 * itemIndex) + item.offset);

        c.save();
        c.scale(0.5, 0.5);
        Img.drawSprite("items", 0, 0, 32, 32, item.item, 0);
        c.restore();

        labelText.drawPosText(24, 14, item.label);
        labelText.drawPosText(132, 14, "123");

        c.restore();
    }

    text.drawPosText(40, 640, getText(gameState));
    //backButton.draw();

    c.restore();

    for(let itemIndex in items) {
        const item = items[itemIndex];
        item.dispenseButton.draw();
        if(itemIndex < 3) {
            item.plantButton.draw();
        }
    }
}