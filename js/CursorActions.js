import * as Entities from "./Entities.js";
import * as Mouse from "./core/input/Mouse.js";
import Vec2 from "./utils/Vec2.js";
import * as DrawSystem from "./systems/DrawSystem.js";
import {newTree} from "./components/Tree.js";
import {newDisplay} from "./components/Display.js";
import {newFactory} from "./components/Factory.js";
import Resources, {addResources, checkResourceAvailability, subtractResources} from "./gamelogic/Resources.js";
import Color from "./utils/Color.js";
import {
    COMPOST_COST,
    LUMBER_HUT_COOL_DOWN,
    SPRINKLER_COST,
    SPRINKLER_WATER_CONSUMPTION,
} from "./gamelogic/MechanicParameters.js";
import {newWaterConsumer} from "./components/WaterConsumer.js";
import * as Actions from "./gamelogic/Actions.js";
import { newItem } from "./components/Item.js";


function toTileCoordinates(position) {
    return new Vec2(
       Math.floor((position.x - DrawSystem.OFFSET_X) / DrawSystem.TILE_SIZE),
       Math.floor((position.y - DrawSystem.OFFSET_Y) / DrawSystem.TILE_SIZE),
    );
}

export function getCursorTile() {
    return Entities.getTileByCoordinates(toTileCoordinates(Mouse.pos));
}

export function PlaceWater(gameState) {
    const tile = getCursorTile();
    if (notOccupied(tile)) {
        Actions.PlaceWater(tile, gameState);
    }
}

export function PlaceTree(gameState, saplingResource) { // saplingResource is a hacky way to define what kind of tree should be planted
    const tile = getCursorTile();
    if (!tile.water && !tile.tree && !tile.factory) {
        if (checkResourceAvailability(
            gameState,
            { [saplingResource]: 1},
        )) {
            subtractResources(
                gameState,
                { [saplingResource]: 1},
            );
            switch(saplingResource) {
                case Resources.PINE_SAPLING:
                    tile.tree = newTree(0, 0);
                    break;
                case Resources.BEECH_SAPLING:
                    tile.tree = newTree(1, 0);
                    break;
                case Resources.OAK_SAPLING:
                    tile.tree = newTree(2, 0);
                    break;
                default:
                    console.error("Invalid tree type");
                    break
            }
        } else {
            console.log("No saplings available", saplingResource);
        }
    }
}

export function PlaceTreeNursery(gameState) {
    const tile = getCursorTile();
    if (!tile.water && !tile.tree && !tile.factory) {
        console.warn("TODO: remove resources!");
        tile.factory = newFactory();
        tile.factory.requiredResources[Resources.PINE_WOOD] = 1;
        tile.factory.productionTime = 5;
        tile.factory.inputResourcesLimit = 5;
        tile.factory.producedResource = Resources.PINE_SAPLING;
        tile.display.buildingSprite = 0;
    }
}

export function PlaceCompostHeap() {
    const tile = getCursorTile();
    if (!tile.water && !tile.tree && !tile.factory) {
        console.warn("TODO: remove resources!");
        tile.factory = newFactory();
        tile.factory.requiredResources[Resources.PINE_WOOD] = COMPOST_COST;
        tile.factory.productionTime = 5;
        tile.factory.inputResourcesLimit = 5;
        tile.factory.producedResource = Resources.COMPOST;
        tile.display.buildingSprite = 4;
    }
}

export function PlacePulleyCrane(gameState) {
    const tile = getCursorTile();

    if (notOccupied(tile)) {
        Actions.PlacePulleyCrane(tile, gameState);
    }
}

export function CutTree(gameState) {
    const tile = getCursorTile();

    if (tile.tree) {
        Actions.CutTree(tile, gameState);
    }
}

function factoryCanBeUnloaded(factory) {
    return factory.producedResource  !== Resources.PLANTBLE_PINE_SAPLING;
}

export function UnloadFactory(gameState) {
    const tile = getCursorTile();
    if (tile.factory ) {
        if (!factoryCanBeUnloaded(tile.factory)) {
            console.log("Factory can't be unloaded");
            return
        }
        const resourceDelta = {
            [tile.factory.producedResource]: 1,
        };

        if(checkResourceAvailability(tile.factory.outputResources, resourceDelta)){
            subtractResources(
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

export function LoadFactory(gameState, resourceType) {
    const tile = getCursorTile();
    if (tile.factory) {
        if (Object.keys(tile.factory.requiredResources).indexOf(resourceType) < 0) {
            console.log('Resource not required here');
            return;
        }
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
        subtractResources(gameState, tile.factory.requiredResources);
        addResources(
            tile.factory.inputResources,
            tile.factory.requiredResources,
        );
        console.log("Factory Loaded");
    }
}

export function Demolish(gameState) {
    const tile = getCursorTile();
    if (tile.source) {
        console.debug("Can't delete source");
        return;
    }
    if (tile.water) {
        delete tile.water;
    }
    if (tile.factory) {
        addResources(
            gameState,
            tile.factory.inputResources,
        );
        addResources(
            gameState,
            tile.factory.outputResources,
        );
        delete tile.factory;
        delete tile.display.buildingSprite;
    }
    delete tile.forester;
    delete tile.sprinkler;
    delete tile.waterConsumer;
    delete tile.compost;
    delete tile.pulleyCrane;
}

export function PlaceSprinkler(gameState) {
    const tile = getCursorTile();
    if (notOccupied(tile)) {
        if (!checkResourceAvailability(
            gameState,
            { [Resources.PINE_WOOD]: SPRINKLER_COST },
        )) {
            console.log("Not enough resources for sprinkler.");
        }
        tile.waterConsumer = newWaterConsumer();
        tile.waterConsumer.consumption = SPRINKLER_WATER_CONSUMPTION;
        tile.sprinkler = true;
        tile.display.buildingSprite = 3;
        subtractResources(
            gameState,
            { [Resources.PINE_WOOD]: SPRINKLER_COST },
        )
    }
}

export function notOccupied(tile) {
    return !(tile.water || tile.tree || tile.factory || tile.sprinkler || tile.forester || tile.lumberHut)
}

export function PlaceForester(gameState) {
    const tile = getCursorTile();
    if(notOccupied(tile)) {
        console.warn("TODO: remove resources!");
        tile.display.buildingSprite = 1;
        tile.forester = true;

        tile.factory = newFactory();
        tile.factory.requiredResources[Resources.PINE_SAPLING] = 1;
        tile.factory.productionTime = 5;
        tile.factory.inputResourcesLimit = 5;
        tile.factory.producedResource = Resources.PLANTBLE_PINE_SAPLING;
    }
}

export function PickResourceFromGround(gameState) {
    const tile = getCursorTile();
    if (tile.item) {
        addResources(
            gameState,
            { [tile.item.type]: 1},
        );
        delete tile.item;
    }
}
export function DropResourceToGround(gameState, resourceType) {
    const tile = getCursorTile();
    if (checkResourceAvailability(gameState, { [resourceType]: 1})) {

        tile.item = newItem(resourceType, tile);
        subtractResources(
            gameState,
            { [resourceType]: 1},
        );

    } else {
        console.log("Can't drop resource because not enough in stock ");
    }
}

export function PlaceLogCabin(gameState) {
    const tile = getCursorTile();
    if(notOccupied(tile)) {
        console.warn("TODO: remove resources!");
        tile.display.buildingSprite = 2;
        tile.factory = newFactory();
        tile.factory.requiredResources[Resources.PINE_SAPLING] = 0; // Indicate that nothing is required
        tile.factory.productionTime = LUMBER_HUT_COOL_DOWN;
        tile.factory.productionTime = 1;
        tile.factory.inputResourcesLimit = 1;
        tile.factory.producedResource = Resources.TREE_CUT_ACTION;
        tile.lumberHut = true;
    }
}

export function FertilizeTile(gameState) {
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
        subtractResources(
            gameState,
            { [Resources.COMPOST]: 1},
        );
    }
}


export const List = [
    PlaceLogCabin,
    PlaceTree,
    PlaceWater,
    CutTree,
    PlaceTreeNursery,
    LoadFactory,
    Demolish,
    UnloadFactory,
    PlaceCompostHeap,
    FertilizeTile,
    PlaceSprinkler,
    PlaceForester,
];
