import * as BasicTooltipPainter from './BasicTooltipPainter.js';
import * as DrawSystem from './systems/DrawSystem.js';
import * as Entities from './Entities.js';
import * as Game from './core/Game.js';
import * as Mouse from './core/input/Mouse.js';
import * as PauseScreen from './PauseScreen.js';
import * as PollutionApplicationSystem from './systems/PollutionApplicationSystem.js';
import * as PollutionGrowthSystem from './systems/PollutionGrowthSystem.js';
import * as Tooltip from './Tooltip.js';
import * as Viewport from './core/Viewport.js';
import { c } from './core/canvas.js';
import * as Timer from './core/Timer.js';
import * as WaterFlowSystem from './systems/WaterFlowSystem.js';
import * as WaterApplicationSystem from './systems/WaterApplicationSystem.js';
import * as ItemApplicationSystem from './systems/ItemDeltaApplicationSystem.js';
import * as TreeSystem from './systems/TreeSystem.js';
import * as PulleyCraneSystem from './systems/PulleyCraneSystem.js';
import * as FactorySystem from './systems/FactorySystem.js';
import * as WaterConsumerSystem from './systems/WaterConsumerSystem.js';
import * as ForesterSystem from './systems/ForesterSystem.js';
import * as LumberHutSystem from './systems/LumberHutSystem.js';
import * as TotalPollutionCounterSystem from './systems/TotalPollutionCounterSystem.js';
import * as CursorActions from './CursorActions.js';
import * as Keyboard from './core/input/Keyboard.js';
import * as UI from './UI.js';
import Resources from './gamelogic/Resources.js';
import {PlaceWater} from './CursorActions.js';
import { ORIENTATION } from './gamelogic/Constants.js';

let tickCountUp = 0;
let animationCountUp = 0;

export const CURSOR_MODES = {
    PICK: 0,
    DROP: 1,
    BUILD: 2,
    DESTROY: 4,
};

export const BUILDING_TYPES = {
    WATER: 1,

    PINE: 10,
    BEECH: 11,
    OAK: 12,

    TREE_NURSERY: 20,
    COMPOST_HEAP: 21,

    SPRINKLER: 30,
    FORESTER: 31,
    LUMBER_HUT: 32,
    PULLEY_CRANE: 33,
};


function handleClick(gameState) {
    if(Keyboard.isPressed(Keyboard.SHIFT)) {
        handlePickUpAction(gameState);
    } else {
        switch (gameState.cursorMode) {
        case CURSOR_MODES.PICK:
            handlePickUpAction(gameState);
            break;
        case CURSOR_MODES.DROP:
            handleDropAction(gameState);
            break;
        case CURSOR_MODES.BUILD:
            handleBuildAction(gameState);
            break;
        case CURSOR_MODES.DESTROY:
            handleDestroyAction(gameState);
            break;
        }
    }
}

function handlePickUpAction(gameState) {
    const tile = CursorActions.getCursorTile();
    if (tile.factory) {
        CursorActions.UnloadFactory(gameState);
    } else if (tile.item) {
        CursorActions.PickResourceFromGround(gameState);
    } else if (tile.tree) {
        CursorActions.CutTree(gameState);
    } else {
        console.warn('Nothing to pick.');
    }
}

function handleDropAction(gameState) {
    const tile = CursorActions.getCursorTile();
    if (tile.factory) {
        CursorActions.LoadFactory(gameState, gameState.selectedResource);
    } else if ((CursorActions.notOccupied(tile) || tile.water) && !tile.item)  {
        CursorActions.DropResourceToGround(gameState, gameState.selectedResource);
    } else {
        console.warn('Can\'t drop stuff here.');
    }

}

function handleBuildAction(gameState) {
    switch (gameState.selectedBuildingType) {
    case BUILDING_TYPES.PINE:
        CursorActions.PlaceTree(gameState, Resources.PINE_SAPLING);
        break;
    case BUILDING_TYPES.BEECH:
        CursorActions.PlaceTree(gameState, Resources.BEECH_SAPLING);
        break;
    case BUILDING_TYPES.OAK:
        CursorActions.PlaceTree(gameState, Resources.OAK_SAPLING);
        break;
    case BUILDING_TYPES.WATER:
        CursorActions.PlaceWater(gameState);
        break;
    case BUILDING_TYPES.PULLEY_CRANE:
        CursorActions.PlacePulleyCrane(gameState);
        break;
    case BUILDING_TYPES.TREE_NURSERY:
        CursorActions.PlaceTreeNursery(gameState);
        break;
    case BUILDING_TYPES.FORESTER:
        CursorActions.PlaceForester(gameState);
        break;
    case BUILDING_TYPES.LUMBER_HUT:
        CursorActions.PlaceLumberHut(gameState);
        break;
    case BUILDING_TYPES.SPRINKLER:
        CursorActions.PlaceSprinkler(gameState);
        break;
    case BUILDING_TYPES.COMPOST_HEAP:
        CursorActions.PlaceCompostHeap(gameState);
        break;
    }
}

function handleDestroyAction(gameState) {
    const tile = CursorActions.getCursorTile();
    if (tile.tree) {
        CursorActions.CutTree(gameState);
    } else {
        CursorActions.Demolish(gameState);
    }
}

export const GameState = {
    cursorMode: CURSOR_MODES.PICK,
    selectedBuildingType: BUILDING_TYPES.OAK,
    orientation: ORIENTATION.NORTH_SOUTH,

    // Resources
    [Resources.PINE_WOOD]: 10,
    [Resources.BEECH_WOOD]: 0,
    [Resources.OAK_WOOD]: 0,
    [Resources.PINE_SAPLING]: 5,
    [Resources.BEECH_SAPLING]: 0,
    [Resources.OAK_SAPLING]: 0,
    [Resources.FERTILIZER]: 0,
};

function reset() {
    Entities.generate();
    tickCountUp = 0;
}

export function show() {

    Tooltip.setPainter(BasicTooltipPainter);
    reset();
    Keyboard.registerKeyUpHandler(Keyboard.D, function() {
        GameState[Resources.PINE_WOOD] += 100;
        GameState[Resources.BEECH_WOOD] += 100;
        GameState[Resources.OAK_WOOD] += 100;
    });
    Keyboard.registerKeyUpHandler(Keyboard.R, () => {
        GameState.orientation = (GameState.orientation + 1) % 4;
    });
    Keyboard.registerKeyUpHandler(Keyboard.Q, () => {
        GameState.cursorMode = CURSOR_MODES.PICK;
    });
    Keyboard.registerKeyUpHandler(Keyboard.X, () => {
        GameState.cursorMode = CURSOR_MODES.DESTROY;
    });
    Keyboard.registerKeyUpHandler(Keyboard.KEY_1, () => {
        keyboardShortcut(BUILDING_TYPES.PULLEY_CRANE, Resources.PINE_SAPLING, BUILDING_TYPES.PINE);
    });
    Keyboard.registerKeyUpHandler(Keyboard.KEY_2, () => {
        keyboardShortcut(BUILDING_TYPES.WATER, Resources.BEECH_SAPLING, BUILDING_TYPES.BEECH);
    });
    Keyboard.registerKeyUpHandler(Keyboard.KEY_3, () => {
        keyboardShortcut(BUILDING_TYPES.TREE_NURSERY, Resources.OAK_SAPLING, BUILDING_TYPES.OAK);
    });
    Keyboard.registerKeyUpHandler(Keyboard.KEY_4, () => {
        keyboardShortcut(BUILDING_TYPES.FORESTER, Resources.PINE_WOOD);
    });
    Keyboard.registerKeyUpHandler(Keyboard.KEY_5, () => {
        keyboardShortcut(BUILDING_TYPES.LUMBER_HUT, Resources.BEECH_WOOD);
    });
    Keyboard.registerKeyUpHandler(Keyboard.KEY_6, () => {
        keyboardShortcut(BUILDING_TYPES.SPRINKLER, Resources.OAK_WOOD);
    });
    Keyboard.registerKeyUpHandler(Keyboard.KEY_7, () => {
        keyboardShortcut(BUILDING_TYPES.COMPOST_HEAP, Resources.FERTILIZER);
    });
    Mouse.left.registerUpArea(
        'map',
        DrawSystem.OFFSET_X,
        DrawSystem.OFFSET_Y,
        DrawSystem.TILE_SIZE * Entities.NUM_TILES_WIDTH,
        DrawSystem.TILE_SIZE * Entities.NUM_TILES_HEIGHT,
        () => handleClick(GameState)
    );

    // do stuff before we update and draw this scene for the first time

}


function keyboardShortcut(building, resource, plant) {
    if(Keyboard.isPressed(Keyboard.SHIFT) && building != null) {
        GameState.cursorMode = CURSOR_MODES.BUILD;
        GameState.selectedBuildingType = building;

    } else if(plant != null && GameState.cursorMode === CURSOR_MODES.DROP && GameState.selectedResource === resource) {
        GameState.cursorMode = CURSOR_MODES.BUILD;
        GameState.selectedBuildingType = plant;

    } else if(resource != null) {
        GameState.cursorMode = CURSOR_MODES.DROP;
        GameState.selectedResource = resource;
    }
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

        tickCountUp += Timer.delta * 6;
        animationCountUp += Timer.delta;

        // Deltas
        if (tickCountUp > 1) {
            for(const entity of Entities.entities) { // Prio 1 system
                PulleyCraneSystem.apply(entity, GameState); // must be before water flow system to make sure items are picked up by cranes before they flow away
            }
            for(const entity of Entities.entities) {
                PollutionGrowthSystem.apply(entity);
                WaterFlowSystem.apply(entity);
                TreeSystem.apply(entity);
                FactorySystem.apply(entity, 1);
                WaterConsumerSystem.apply(entity); // must be after WaterFlowSystem
                ForesterSystem.apply(entity);
                LumberHutSystem.apply(entity, GameState);
            }
        }

        // Application
        TotalPollutionCounterSystem.reset();
        for(const entity of Entities.entities) {
            if (tickCountUp > 1) {
                PollutionApplicationSystem.apply(entity);
                WaterApplicationSystem.apply(entity);
                ItemApplicationSystem.apply(entity, GameState);
            }
            TotalPollutionCounterSystem.apply(entity);
        }

        if(Mouse.left.down && Mouse.isOver(
            DrawSystem.OFFSET_X,
            DrawSystem.OFFSET_Y,
            DrawSystem.TILE_SIZE * Entities.NUM_TILES_WIDTH,
            DrawSystem.TILE_SIZE * Entities.NUM_TILES_HEIGHT,
        )) {
            if(GameState.cursorMode === CURSOR_MODES.BUILD && GameState.selectedBuildingType === BUILDING_TYPES.WATER) {
                PlaceWater(GameState);
            }
        }

        // update stuff except when paused

        tickCountUp -= tickCountUp > 1 ? 1 : 0;
        animationCountUp -= animationCountUp > 1 ? 1 : 0;
    }
}


export function draw() {

    // clear scene
    c.fillStyle = '#222';
    c.fillRect(0, 0, Viewport.width, Viewport.height);

    c.save();
    c.translate(DrawSystem.OFFSET_X, DrawSystem.OFFSET_Y);

    for(const entity of Entities.entities) {
        DrawSystem.applyGround(entity, tickCountUp);
    }
    for(const entity of Entities.entities) {
        DrawSystem.applyOverlay(entity, tickCountUp, animationCountUp, GameState);
    }

    c.restore();

    c.fillStyle = '#222';
    c.fillRect(0, 0, Viewport.width, DrawSystem.OFFSET_Y);

    UI.draw(GameState);

    c.fillStyle = '#ccc';
    c.fillRect(11, 10, 1586, 2);
    c.fillRect(11, 1068, 1586, 2);
    c.fillRect(10, 11, 2, 1058);
    c.fillRect(1596, 11, 2, 1058);

    // draw tooltip

    Tooltip.draw();

    // draw pause screen when paused
    PauseScreen.draw();
}
