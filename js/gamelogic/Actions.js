import Resources from "./Resources.js";
import { newWater } from "../components/Water.js";
import {checkResourceAvailability, removeResources} from "./Resources.js";
import { WATER_COST } from "./MechanicParameters.js";

export function CutTree(entity, gameState) {
    switch (entity.tree.type) {
        case 0:
            if (entity.tree.level === 100) {
                gameState[Resources.PINE_WOOD] += 15;
            } else {
                gameState[Resources.PINE_WOOD] += Math.floor(entity.tree.level / 10);
            }
            break;
        case 1:
            if (entity.tree.level === 100) {
                gameState.beechWood += 15;
            } else {
                gameState.beechWood += Math.floor(entity.tree.level / 10);
            }
            break;
        case 2:
            if (entity.tree.level === 100) {
                gameState.oakWood += 15;
            } else {
                gameState.oakWood += Math.floor(entity.tree.level / 10);
            }
            break;
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
