import * as BasicTooltipPainter from "./BasicTooltipPainter.js"
import * as DrawSystem from "./systems/DrawSystem.js";
import * as Entities from "./Entities.js";
import * as Game from "./core/Game.js";
import * as Mouse from "./core/input/Mouse.js";
import * as PauseScreen from "./PauseScreen.js";
import * as PollutionApplicationSystem from "./systems/PollutionApplicationSystem.js";
import * as PollutionGrowthSystem from "./systems/PollutionGrowthSystem.js";
import * as Tooltip from "./Tooltip.js";
import * as Viewport from "./core/Viewport.js";
import { c } from "./core/canvas.js";
import * as Timer from "./core/Timer.js"
import Vec2 from "./utils/Vec2.js";
import * as WaterFlowSystem from "./systems/WaterFlowSystem.js"
import * as WaterApplicationSystem from "./systems/WaterApplicationSystem.js"

let oneSecCountdown = 0;


function reset() {
    Entities.generate();
    oneSecCountdown = 0;
}

function toTileCoordinates(position) {
    return new Vec2(
        Math.floor(Mouse.pos.x / DrawSystem.TILE_SIZE),
        Math.floor(Mouse.pos.y / DrawSystem.TILE_SIZE),
    );
}

export function show() {

    Tooltip.setPainter(BasicTooltipPainter);
    reset();
    Mouse.left.registerUpArea(
        'map',
        0,
        0,
        DrawSystem.TILE_SIZE * Entities.NUM_TILES_WIDTH,
        DrawSystem.TILE_SIZE * Entities.NUM_TILES_HEIGHT,
        () => {
            const tile = Entities.getTileByCoordinates(toTileCoordinates(Mouse.pos));
            if (tile.water) {
                delete tile.water;
            } else {
                tile.water = {
                    source: false,
                    level: 0,
                    delta: 0,
                };
            }
        }
    )

    // do stuff before we update and draw this scene for the first time

}


export function hide() {

    // do stuff before we draw and update the next scene

}


export function resize() {

    // do stuff when window is resized

}


export function click() {

    // do stuff when left mouse button is clicked

}


export function update() {

    // reset tooltip content
    Tooltip.reset();

    // update stuff here

    if(!Game.paused) {

        oneSecCountdown += Timer.delta * 5;

        // Deltas
        for(const entity of Entities.entities) {
            if (oneSecCountdown > 1) {
                PollutionGrowthSystem.apply(entity);
                WaterFlowSystem.apply(entity);
            }
        }

        // Application
        for(const entity of Entities.entities) {
            if (oneSecCountdown > 1) {
                PollutionApplicationSystem.apply(entity);
                WaterApplicationSystem.apply(entity);
            }
        }

        // update stuff except when paused

        oneSecCountdown -= oneSecCountdown > 1 ? 1 : 0;
    }
}


export function draw() {

    // clear scene
    c.fillStyle = "#fff";
    c.fillRect(0, 0, Viewport.width, Viewport.height);

    for(const entity of Entities.entities) {
        DrawSystem.apply(entity);
    }

    // draw tooltip
    Tooltip.draw();

    // draw pause screen when paused
    PauseScreen.draw();
}