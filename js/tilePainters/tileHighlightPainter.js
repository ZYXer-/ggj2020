import { c } from '../core/canvas.js';
import { CURSOR_MODES } from '../IngameScene.js';
import * as Keyboard from '../core/input/Keyboard.js';


export function drawTileHighlight(gameState) {
    c.fillStyle = '#fff';
    if(gameState.cursorMode === CURSOR_MODES.DESTROY && !Keyboard.isPressed(Keyboard.SHIFT)) {
        c.fillStyle = '#d00';
    }
    c.fillRect(0, -1, 48, 2);
    c.fillRect(0, 47, 48, 2);
    c.fillRect(-1, 0, 2, 48);
    c.fillRect(47, 0, 2, 48);
}