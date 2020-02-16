import Resources from "./Resources.js";
import { newWater } from "../components/Water.js";
import {checkResourceAvailability, removeResources} from "./Resources.js";
import { WATER_COST } from "./MechanicParameters.js";

export function CutTree(entity, gameState) {
    let resourceType;
    switch (entity.tree.type) {
        case 0:
            resourceType = Resources.PINE_WOOD;
            break;
        case 1:
            resourceType = Resources.BEECH_WOOD;
            break
        case 2:
            resourceType = Resources.OAK_WOOD;
            break;
    }
    if (entity.tree.level === 100) {
        gameState[resourceType] += 15;
    } else {
        gameState[resourceType] += Math.floor(entity.tree.level / 10);
    }
    delete entity.tree;
}

export function PlaceWater(tile, gameState) {
    if(checkResourceAvailability(
        gameState,
        WATER_COST,
    )) {
        removeResources(
            gameState,
            WATER_COST,
        );
        tile.water = newWater(false);
    }
}
