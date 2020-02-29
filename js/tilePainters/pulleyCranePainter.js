import { c } from '../core/canvas.js';
import { HALF_PI } from '../utils/GeometryUtils.js';
import { drawCircle } from '../utils/DrawUtils.js';
import * as Img from '../core/Img.js';


export function drawPulleyCrane(entity, hover) {

    c.save();
    c.translate(24, 24);
    c.scale(0.5, 0.5);

    c.rotate(HALF_PI * (entity.pulleyCrane.orientation + 1));
    Img.drawSprite('buildings', -96, -96, 192, 192, 5, 0);

    if(hover) {
        c.globalAlpha = 1;
        c.strokeStyle = '#fff';
        c.lineWidth = 5;
        drawCircle(c, -96, 0, 12);
        c.stroke();

        c.fillStyle = '#fff';
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

    c.restore();
}