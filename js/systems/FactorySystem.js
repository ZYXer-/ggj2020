// import Resources from "../gamelogic/Resources.js";
import { subtractResources, checkResourceAvailability, addResources } from "../gamelogic/Resources.js";

function productionLimitReached(factory) {
    return factory.outputResources[factory.producedResource] >= factory.outputResourcesLimit
}

export function apply(tile, timeDelta) {
    if (tile.factory) {
        // Update
        if (checkResourceAvailability(
            tile.factory.inputResources,
            tile.factory.requiredResources,
            ) && !productionLimitReached(tile.factory)) {
            tile.factory.productionProgress += timeDelta;
        }

        // Check if production finished
        if (tile.factory.productionProgress >= tile.factory.productionTime) {
            addResources(
                tile.factory.outputResources,
                {
                    [tile.factory.producedResource]: 1,
            });
            subtractResources(tile.factory.inputResources, tile.factory.requiredResources);
            tile.factory.productionProgress = 0;
            console.log("Resource produced");
        }
    }
}