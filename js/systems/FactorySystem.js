// import Resources from "../gamelogic/Resources.js";
import { removeResources } from "../gamelogic/Resources.js";

function productionLimitReached(factory) {
    return factory.outputResources[factory.producedResource] > factory.outputResourcesLimit
}

export function apply(tile, timeDelta) {
    if (tile.factory) {
        // Update
        if (checkResourceAvailability(
            tile.factory.inputResourcesLimit,
            tile.factory.requiredResources,
            ) && productionLimitReached(tile.factory)) {
            tile.factory.productionProgress += timeDelta;
        }

        // Check if production finished
        if (tile.factory.productionProgress >= tile.factory.productionTime) {
            tile.factory.outputResources[tile.factory.producedResource] += 1;
            removeResources(tile.factory.inputResources, tile.factory.requiredResources);

            if(productionLimitReached(tile.factory)) {
               tile.factory.productionProgress = tile.factory.productionProgress % tile.factory.productionTime;
            }
            console.log("Resource produced");
        }
    }
}