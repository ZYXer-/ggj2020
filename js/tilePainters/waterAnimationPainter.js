import { c } from '../core/canvas.js';


export function drawWaterAnimation(entity) {
    if(entity.water.output) {
        const direction = entity.water.output.position.subtract(entity.position);
        c.beginPath();
        c.moveTo(24, 24);
        c.lineTo(24 + direction.x * 20, 24 + direction.y * 20);
        c.strokeStyle = '#00f';
        c.lineWidth = 4;
        c.stroke();
        let rotation = direction.angle();
        c.save();
        c.translate(24, 24);
        c.rotate(-rotation);
        c.fillStyle = '#00f';
        c.beginPath();
        c.moveTo(0, 24);
        c.lineTo(10, 14);
        c.lineTo(-10, 14);
        c.closePath();
        c.fill();
        c.restore();
    }
}