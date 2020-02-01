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
import * as WaterFlowSystem from "./systems/WaterFlowSystem.js"
import * as WaterApplicationSystem from "./systems/WaterApplicationSystem.js"
import * as TreeSystem from "./systems/TreeSystem.js"
import * as FactorySystem from "./systems/FactorySystem.js"
import * as WaterConsumerSystem from "./systems/WaterConsumerSystem.js"
import * as ForesterSystem from "./systems/ForesterSystem.js"
import * as CursorActions from "./CursorActions.js";
import * as Keyboard from "./core/input/Keyboard.js";
import * as UI from "./UI.js"
import Resources from "./gamelogic/Resources.js";

let oneSecCountdown = 0;

const GameState = {
    cursorActionIndex: 0,
    cursorAction: CursorActions.List[0],
    [Resources.PINE_WOOD]: 1000,
    [Resources.PINE_SAPLING]: 5,
    [Resources.COMPOST]: 5,
    beechWood: 0,
    oakWood: 0,
};

function reset() {
    Entities.generate();
    oneSecCountdown = 0;
}

function iterateCursorAction(gameState, cursorActions) {
   gameState.cursorActionIndex = (gameState.cursorActionIndex + 1) % cursorActions.length;
   gameState.cursorAction = cursorActions[gameState.cursorActionIndex];
}


export function show() {

    Tooltip.setPainter(BasicTooltipPainter);
    reset();

    Keyboard.registerKeyUpHandler(Keyboard.D, function() {
        debugger;
    });
    Keyboard.registerKeyUpHandler(Keyboard.W, function() {
        iterateCursorAction(GameState, CursorActions.List);
    });
    Mouse.left.registerUpArea(
        'map',
        0,
        0,
        DrawSystem.TILE_SIZE * Entities.NUM_TILES_WIDTH,
        DrawSystem.TILE_SIZE * Entities.NUM_TILES_HEIGHT,
        () => GameState.cursorAction(GameState)
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
                TreeSystem.apply(entity);
                FactorySystem.apply(entity, 1);
                WaterConsumerSystem.apply(entity); // must be after WaterFlowSystem
                ForesterSystem.apply(entity);
            }
        }

        // Application
        for(const entity of Entities.entities) {
            if (oneSecCountdown > 1) {
                PollutionApplicationSystem.apply(entity);
                WaterApplicationSystem.apply(entity);
            }
        }

        if(Mouse.left.down) {
            CursorActions.mouseDown(GameState);
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
        DrawSystem.applyGround(entity);
    }
    for(const entity of Entities.entities) {
        DrawSystem.applyOverlay(entity);
    }

    // draw tooltip
    UI.draw(GameState);
    Tooltip.draw();

    // draw pause screen when paused
    PauseScreen.draw();
}