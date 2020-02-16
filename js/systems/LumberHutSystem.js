import Resources, { checkResourceAvailability } from "../gamelogic/Resources.js";
import { MAX_TREE_LEVEL } from "../gamelogic/MechanicParameters.js";
import { subtractResources } from "../gamelogic/Resources.js";
import { rand } from "../utils/Utils.js";
import * as Actions from "../gamelogic/Actions.js";
import { addResources } from "../gamelogic/Resources.js";

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
                const harvestedResources = {};
                //TODO: use this function in a different way, when it was created we used it to add the resources to the global state. Now we add the resources to the hut it self.
                Actions.CutTree(target, harvestedResources);
                addResources(entity.factory.outputResources, harvestedResources);
                console.debug("Lumberjack outstack", entity.factory.outputResources);
            }
        }
    }
}