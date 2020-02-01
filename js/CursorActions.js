import * as Entities from "./Entities.js";
import * as Mouse from "./core/input/Mouse.js";
import Vec2 from "./utils/Vec2.js";
import * as DrawSystem from "./systems/DrawSystem.js";
import {newTree} from "./components/Tree.js";
import {newDisplay} from "./components/Display.js";
import {newFactory} from "./components/Factory.js";
import Resources from "./gamelogic/Resources.js";
import { addResources, checkResourceAvailability, removeResources } from "./gamelogic/Resources.js";
import Color from "./utils/Color.js";
import { COMPOST_COST, SPRINKLER_COST, SPRINKLER_WATER_CONSUMPTION } from "./gamelogic/MechanicParameters.js";
import { newWaterConsumer } from "./components/WaterConsumer.js";


function toTileCoordinates(position) {
    return new Vec2(
        Math.floor(position.x / DrawSystem.TILE_SIZE),
        Math.floor(position.y / DrawSystem.TILE_SIZE),
    );
}

function getCursorTile() {
    return Entities.getTileByCoordinates(toTileCoordinates(Mouse.pos));
}

export function PlaceWater() {
    const tile = getCursorTile();
    if (!tile.water && !tile.tree && !tile.factory) {
        tile.water = {
            source: false,
            level: 0,
            delta: 0,
        };
    }
}

export function PlaceTree(gameState) {
    const tile = getCursorTile();
    if (!tile.water && !tile.tree && !tile.factory) {
        if (checkResourceAvailability(
            gameState,
            { [Resources.PINE_SAPLING]: 1},
        )) {
            tile.tree = newTree();
            tile.display = newDisplay();
            removeResources(
                gameState,
                { [Resources.PINE_SAPLING]: 1},
            );
        } else {
            console.log("No saplings available")
        }
    }
}

export function PlaceTreeNursery() {
    const tile = getCursorTile();
    if (!tile.water && !tile.tree && !tile.factory) {
       tile.factory = newFactory();
       tile.factory.requiredResources[Resources.PINE_WOOD] = 1;
       tile.factory.productionTime = 5;
       tile.factory.inputResourcesLimit = 5;
       tile.factory.producedResource = Resources.PINE_SAPLING;
    }
}

export function PlaceCompostHeap() {
    const tile = getCursorTile();
    if (!tile.water && !tile.tree && !tile.factory) {
        tile.factory = newFactory();
        tile.factory.requiredResources[Resources.PINE_WOOD] = COMPOST_COST;
        tile.factory.productionTime = 5;
        tile.factory.inputResourcesLimit = 5;
        tile.factory.producedResource = Resources.COMPOST;
        tile.display = newDisplay(0,0,Color.fromHex('#b53803'))
    }
}

export function CutTree(gameState) {
    const tile = getCursorTile();

    if (tile.tree) {
        switch (tile.tree.type) {
            case 0:
                if (tile.tree.level === 100) {
                    gameState[Resources.PINE_WOOD] += 15;
                } else {
                    gameState[Resources.PINE_WOOD] += Math.floor(tile.tree.level / 10);
                }
                break;
            case 1:
                if (tile.tree.level === 100) {
                    gameState.beechWood += 15;
                } else {
                    gameState.beechWood += Math.floor(tile.tree.level / 10);
                }
                break;
            case 2:
                if (tile.tree.level === 100) {
                    gameState.oakWood += 15;
                } else {
                    gameState.oakWood += Math.floor(tile.tree.level / 10);
                }
                break;
        }
        delete tile.tree;
    }
}

export function UnloadFactory(gameState) {
    const tile = getCursorTile();
    if (tile.factory ) {
        const resourceDelta = {
            [tile.factory.producedResource]: 1,
        };
        if(checkResourceAvailability(tile.factory.outputResources, resourceDelta)){
            removeResources(
                tile.factory.outputResources,
                resourceDelta
                );
            addResources(
                gameState,
                resourceDelta,
            );
        }
    }
}

export function LoadFactory(gameState) {
    const tile = getCursorTile();
    if (tile.factory) {
        if (checkResourceAvailability(
            tile.factory.inputResources,
            tile.factory.requiredResources,
            tile.factory.inputResourcesLimit,
        )) {
            console.log("Input stock is full");
            return;
        }
        console.log(tile.factory.inputResources);
        // Check if resources available
        if (!checkResourceAvailability(gameState, tile.factory.requiredResources)) {
            console.log("Not enough resources");
            return;
        }
        removeResources(gameState, tile.factory.requiredResources);
        addResources(
            tile.factory.inputResources,
            tile.factory.requiredResources,
        );
        console.log("Factory Loaded");
    }
}

export function Demolish(gameState) {
    const tile = getCursorTile();
    if (tile.water) {
        delete tile.water;
    }
}

export function PlaceSprinkler(gameState) {
    const tile = getCursorTile();
    if (!(tile.water || tile.tree || tile.factory || tile.sprinkler)) {
        if (!checkResourceAvailability(
            gameState,
            { [Resources.PINE_WOOD]: SPRINKLER_COST },
        )) {
            console.log("Not enough resources for sprinkler.");
        }
        tile.waterConsumer = newWaterConsumer();
        tile.waterConsumer.consumption = SPRINKLER_WATER_CONSUMPTION;
        tile.sprinkler = true;
        tile.display = newDisplay(
            0,
            0,
            Color.fromHex('#702265'),
        );
        removeResources(
            gameState,
            { [Resources.PINE_WOOD]: SPRINKLER_COST },
        )
    }
}

export function FertelizeTile(gameState) {
    const tile = getCursorTile();
    if (true) { // What can be fertelized?
        if (!checkResourceAvailability(gameState, { [Resources.COMPOST]: 1})) {
            console.log("No Compost available");
            return;
        }
        if (tile.compost && tile.compost > 0) {
            console.log("Already Fertelized");
            return;
        }
        tile.compost = 1;
        removeResources(
            gameState,
            { [Resources.COMPOST]: 1},
        );
    }
}

export function mouseDown(gameState) {
    if(gameState.cursorAction === PlaceWater) {
        PlaceWater();
    }
}

export const List = [
    PlaceTree,
    PlaceWater,
    CutTree,
    PlaceTreeNursery,
    LoadFactory,
    Demolish,
    UnloadFactory,
    PlaceCompostHeap,
    FertelizeTile,
    PlaceSprinkler,
];
