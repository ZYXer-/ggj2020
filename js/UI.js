import Text from "./utils/Text.js";
import * as Img from "./core/Img.js";
import * as PollutionApplicationSystem from "./systems/PollutionApplicationSystem.js";
import Button from "./utils/Button.js";
import {c} from "./core/canvas.js";
import Color from "./utils/Color.js";
import * as TotalPollutionCounterSystem from "./systems/TotalPollutionCounterSystem.js";

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

let backButton = new Button({
    x: 20,
    y: 20,
    w: 150,
    h: 40,
    click() {
        console.log("TEST");
    },
    draw(x, y, w, h, isOver, down) {
        c.fillStyle = "#9cf";
        if(isOver) {
            c.fillStyle = "#bdf";
            if(down) {
                y += 2;
            }
        }
        c.fillRect(x, y, w, h);
        Text.draw(x + (w / 2), y + 25, 16, "opensans", "center", "#000", "< back to menu");
    }
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

    text.drawPosText(40, 340, getText(gameState));
    //backButton.draw();

    c.restore();
}