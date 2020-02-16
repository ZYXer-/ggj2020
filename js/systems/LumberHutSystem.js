import Resources, { checkResourceAvailability } from "../gamelogic/Resources.js";
import { MAX_TREE_LEVEL } from "../gamelogic/MechanicParameters.js";
import { subtractResources } from "../gamelogic/Resources.js";
import { rand } from "../utils/Utils.js";
import * as Actions from "../gamelogic/Actions.js";

export function apply(entity, gameState) {
    if (entity && entity.lumberHut) {
        if (checkResourceAvailability(
            entity.factory.outputResources,
            { [Resources.TREE_CUT_ACTION]: 1},
        )) {
            const fullGrownTrees = entity.hood2.filter(e => e.tree && e.tree.level === MAX_TREE_LEVEL)

            if (fullGrownTrees.length > 0) {
                const target = fullGrownTrees[rand(0, fullGrownTrees.length - 1)];
                subtractResources(
                    entity.factory.outputResources,
                    { [Resources.TREE_CUT_ACTION]: 1},
                );
                Actions.CutTree(target, gameState);
            }
        }
    }
}