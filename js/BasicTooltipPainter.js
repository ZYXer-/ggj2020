import Vec2 from './utils/Vec2.js';
import Text from './utils/Text.js';
import { c } from './core/canvas.js';
import {max} from './utils/Utils.js';
import {drawRoundedCornerRect} from './utils/DrawUtils.js';


export const DISTANCE_TO_MOUSE = 10;
export const DISTANCE_TO_WINDOW_BORDER = 20;
export const DISPLAY_DELAY = 0;

const HORIZONTAL_PADDING = 10;
const VERTICAL_PADDING = 8;

let mode = 0;
let lines = 0;
let hasHint = false;

let titleDrawable = null;
let lineDrawables = [];
let hintDrawable = null;



export function insertNewContent(content) {

    if(titleDrawable === null) {
        initTextDrawables();
    }
    const parts = content.split('///');
    mode = parts[0];

    lines = 0;
    hasHint = false;

    let width = 0;
    let height = 0;
    if(mode === 'simple') {
        // TODO
    } else if(mode === 'full') {
        titleDrawable.setText(parts[1]);
        width = titleDrawable.getWidth();
        height += titleDrawable.getHeight() + 9;
        for(let i = 2; i < parts.length; i++) {
            if(parts[i] !== '') {
                if(parts[i] === '===') {
                    height += 6;
                } else if(parts[i].substr(0, 3) === '$$$') {
                    hintDrawable.setText(parts[i].substr(3));
                    hintDrawable.setPos(0, height + 18);
                    width = max(width, hintDrawable.getWidth());
                    height += hintDrawable.getHeight() + 6;
                    hasHint = true;
                    break;
                } else if(parts[i].substr(0, 3) === '###') {
                    lineDrawables[lines].setText(parts[i].substr(3));
                    lineDrawables[lines].setPos(16, height + 12);
                    width = max(width, lineDrawables[lines].getWidth() + 16);
                    height += lineDrawables[lines].getHeight();
                    lines++;
                } else {
                    lineDrawables[lines].setText(parts[i]);
                    lineDrawables[lines].setPos(8, height + 12);
                    width = max(width, lineDrawables[lines].getWidth() + 8);
                    height += lineDrawables[lines].getHeight();
                    lines++;
                }
            }
        }
    }

    width += 2 * HORIZONTAL_PADDING;
    height += 2 * VERTICAL_PADDING;

    return new Vec2(width, height);
}


export function draw(content, dimensions) {

    c.fillStyle = '#222';
    c.strokeStyle = '#ccc';
    c.lineWidth = 2;
    drawRoundedCornerRect(0, 0, dimensions.x, dimensions.y, 4);
    c.fill();
    c.stroke();

    c.translate(HORIZONTAL_PADDING, VERTICAL_PADDING);

    titleDrawable.draw();

    for(let i = 0; i < lines; i++) {
        lineDrawables[i].draw();
    }

    if(hasHint) {
        hintDrawable.draw();
    }

}


function initTextDrawables() {
    titleDrawable = new Text({
        x : 0,
        y : 21,
        size : 20,
        font : 'norwester',
        color : '#ccc',
        maxWidth : 280,
        lineHeight : 24
    });
    for(let i = 0; i < 10; i++) {
        lineDrawables[i] = new Text({
            size : 16,
            font : 'norwester',
            color : '#ccc',
            maxWidth : 280,
            lineHeight : 18
        });
    }
    hintDrawable = new Text({
        x : 0,
        y : 12,
        size : 16,
        font : 'norwester',
        color : '#999',
        maxWidth : 280,
        lineHeight : 18
    });
}