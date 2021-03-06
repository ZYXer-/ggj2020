import * as Entities from './Entities.js';
import * as Mouse from './core/input/Mouse.js';
import Vec2 from './utils/Vec2.js';
import * as DrawSystem from './systems/DrawSystem.js';
import {newTree} from './components/Tree.js';
import {newDisplay} from './components/Display.js';
import {newFactory} from './components/Factory.js';
import Resources, {addResources, checkResourceAvailability, subtractResources} from './gamelogic/Resources.js';
import Color from './utils/Color.js';
import {
    COMPOST_HEAP_COST,
    COMPOST_HEAP_INPUT_RECOURCES,
	COMPOST_HEAP_INPUT_RECOURCES_LIMIT,
	COMPOST_HEAP_COOL_DOWN,
    LUMBERHUT_COST,
    LUMBER_HUT_COOL_DOWN,
    SPRINKLER_COST,
    SPRINKLER_WATER_CONSUMPTION,
    FORESTER_COST,
    FORESTER_COOL_DOWN,
    FORESTER_INPUT_RECOURCES,
    FORESTER_INPUT_RECOURCES_LIMIT,
	PULLYCRANE_COST,
	TREENURCERY_COST,
	TREENURCERY_INPUT_RECOURCES,
	TREENURCERY_INPUT_RECOURCES_LIMIT,
	TREENURCERY_COOL_DOWN,
} from './gamelogic/MechanicParameters.js';
import {newWaterConsumer} from './components/WaterConsumer.js';
import * as Actions from './gamelogic/Actions.js';
import { newItem } from './components/Item.js';


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
                console.error('Invalid tree type');
                break;
            }
        } else {
            console.log('No saplings available', saplingResource);
        }
    }
}

export function PlaceTreeNursery(gameState) {
    const tile = getCursorTile();
    if (notOccupied(tile) && checkResourceAvailability(
            gameState,
            TREENURCERY_COST,
        )){ 
        subtractResources(
            gameState,
            TREENURCERY_COST,
        );
        tile.factory = newFactory();
        tile.factory.requiredResources[Resources.PINE_WOOD] = TREENURCERY_INPUT_RECOURCES;
        tile.factory.productionTime = TREENURCERY_COOL_DOWN;
        tile.factory.inputResourcesLimit = TREENURCERY_INPUT_RECOURCES_LIMIT;
        tile.factory.producedResource = Resources.PINE_SAPLING;
        tile.treeNursery = true;
        tile.display.buildingSprite = 0;
    }
}

export function PlaceCompostHeap(gameState) {
    const tile = getCursorTile();
    if (notOccupied(tile) && checkResourceAvailability(
            gameState,
            COMPOST_HEAP_COST,
        )){ 
        subtractResources(
            gameState,
            COMPOST_HEAP_COST,
        );
        tile.factory = newFactory();
        tile.factory.requiredResources[Resources.PINE_WOOD] = COMPOST_HEAP_INPUT_RECOURCES;
        tile.factory.productionTime = COMPOST_HEAP_COOL_DOWN;
        tile.factory.inputResourcesLimit = COMPOST_HEAP_INPUT_RECOURCES_LIMIT;
        tile.factory.producedResource = Resources.FERTILIZER;
        tile.compostHeap = true;
        tile.display.buildingSprite = 4;
    }
}

export function PlacePulleyCrane(gameState) {
    const tile = getCursorTile();

    if (notOccupied(tile) && checkResourceAvailability(
            gameState,
            PULLYCRANE_COST,
        )){ 
        subtractResources(
            gameState,
            PULLYCRANE_COST,
        );
        Actions.PlacePulleyCrane(tile, gameState);
    }
}

export function PlaceSprinkler(gameState) {
    const tile = getCursorTile();
    if (notOccupied(tile) && checkResourceAvailability(
            gameState,
            SPRINKLER_COST,
        )){ 
        subtractResources(
            gameState,
            SPRINKLER_COST,
        );
        tile.waterConsumer = newWaterConsumer();
        tile.waterConsumer.consumption = SPRINKLER_WATER_CONSUMPTION;
        tile.sprinkler = true;
        tile.display.buildingSprite = 3;
	}
}

export function PlaceForester(gameState) {
    const tile = getCursorTile();
    if (notOccupied(tile) && checkResourceAvailability(
            gameState,
            FORESTER_COST,
        )){ 
        subtractResources(
            gameState,
            FORESTER_COST,
        );
        tile.factory = newFactory();
        tile.factory.requiredResources[Resources.PINE_SAPLING] = FORESTER_INPUT_RECOURCES;
        tile.factory.productionTime = FORESTER_COOL_DOWN;
        tile.factory.inputResourcesLimit = FORESTER_INPUT_RECOURCES_LIMIT;
        tile.factory.producedResource = Resources.PLANTBLE_PINE_SAPLING;
        tile.forester = true;
        tile.display.buildingSprite = 1;
    }
}

export function PlaceLumberHut(gameState) {
    const tile = getCursorTile();
    if (notOccupied(tile) && checkResourceAvailability(
            gameState,
            LUMBERHUT_COST,
        )){ 
        subtractResources(
            gameState,
            LUMBERHUT_COST,
        );
        tile.display.buildingSprite = 2;
        tile.factory = newFactory();
        tile.factory.productionTime = LUMBER_HUT_COOL_DOWN;
        tile.factory.producedResource = Resources.TREE_CUT_ACTION;
        tile.lumberHut = true;
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
            console.log('Factory can\'t be unloaded');
            return;
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
            console.log('Input stock is full');
            return;
        }
        console.log(tile.factory.inputResources);
        // Check if resources available
        if (!checkResourceAvailability(gameState, tile.factory.requiredResources)) {
            console.log('Not enough resources');
            return;
        }
        subtractResources(gameState, tile.factory.requiredResources);
        addResources(
            tile.factory.inputResources,
            tile.factory.requiredResources,
        );
        console.log('Factory Loaded');
    }
}

export function Demolish(gameState) {
    const tile = getCursorTile();
    if (tile.source) {
        console.debug('Can\'t delete source');
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
    delete tile.pulleyCrane;
    delete tile.treeNursery;
    delete tile.forester;
    delete tile.lumberHut;
    delete tile.sprinkler;
    delete tile.compostHeap;
    delete tile.waterConsumer;
}


export function notOccupied(tile) {
    return !(tile.tree
        || tile.water
        || tile.pulleyCrane
        || tile.treeNursery
        || tile.forester
        || tile.lumberHut
        || tile.sprinkler
        || tile.compostHeap
    );
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
        console.log('Can\'t drop resource because not enough in stock ');
    }
}

export function FertilizeTile(gameState) {
    const tile = getCursorTile();
    if (true) { // What can be fertelized?
        if (!checkResourceAvailability(gameState, { [Resources.FERTILIZER]: 1})) {
            console.log('No Compost available');
            return;
        }
        if (tile.fertilizer && tile.fertilizer > 0) {
            console.log('Already Fertelized');
            return;
        }
        tile.fertilizer = 1;
        subtractResources(
            gameState,
            { [Resources.FERTILIZER]: 1},
        );
    }
}


export const List = [
    PlaceLumberHut,
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
