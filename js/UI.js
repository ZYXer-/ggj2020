import Text from "./utils/Text.js";
import { NUM_TILES_HEIGHT, NUM_TILES_WIDTH } from "./Entities.js";
import { TILE_SIZE } from "./systems/DrawSystem.js";
import Resources from "./gamelogic/Resources.js";
import Button from "./utils/Button.js";
import {c} from "./core/canvas.js";

let text = new Text({
            size : 24,
            // font : "komika",
            // align : "right",
            color : "#000",
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
    text.drawPosText(
        TILE_SIZE * NUM_TILES_WIDTH + 20,
        100,
        // TILE_SIZE * NUM_TILES_HEIGHT,
        getText(gameState),
    );
    backButton.draw();
}