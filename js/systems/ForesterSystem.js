import Resources, { checkResourceAvailability, subtractResources } from "../gamelogic/Resources.js";
import { notOccupied } from "../CursorActions.js";
import { rand } from "../utils/Utils.js";
import { newTree } from "../components/Tree.js";
import { newDisplay } from "../components/Display.js";

export function apply(entity) {
    if (entity.forester) {
        if (checkResourceAvailability(
            entity.factory.outputResources,
            { [Resources.PLANTBLE_PINE_SAPLING]: 1},
            )) {
            const freeTiles = entity.hood2.filter(e => notOccupied(e));
            if (freeTiles.length > 0) {
                const target = freeTiles[rand(0, freeTiles.length - 1)];
                target.tree = newTree(0, 0);
                subtractResources(
                    entity.factory.outputResources,
                    { [Resources.PLANTBLE_PINE_SAPLING]: 1},
                );
                target.display = newDisplay();
            }
        }

    }
}