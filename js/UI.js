import Text from "./utils/Text.js";
import { NUM_TILES_HEIGHT, NUM_TILES_WIDTH } from "./Entities.js";
import { TILE_SIZE } from "./systems/DrawSystem.js";
import Resources from "./utils/Resources.js";

let text = new Text({
            size : 16,
            // font : "komika",
            // align : "right",
            color : "#000",
            // borderWidth : 5,
            // borderColor : "#000",
            // maxWidth : 250,
            // lineHeight : 50,
            verticalAlign : "bottom",
            // letterSpacing : 3,
            // appearCharPerSec : 10,
            // monospaced : 25,
        });

export function update(gameState) {

}

function getText(gameState) {
    return `\
        Action:  ${gameState.cursorAction.name}\n\
        Pine Wood: ${gameState[Resources.PINE_WOOD]}\
        Beech Wood: ${gameState.beechWood}\
        Oak Wood: ${gameState.oakWood}\
    `
}
export function draw(gameState) {
    text.drawPosText(
        TILE_SIZE * NUM_TILES_WIDTH + 20,
        100,
        // TILE_SIZE * NUM_TILES_HEIGHT,
        getText(gameState),
    )
}
