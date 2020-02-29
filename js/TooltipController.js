import * as Keyboard from './core/input/Keyboard.js';
import { CURSOR_MODES } from './IngameScene.js';
import { ORIENTATION } from './gamelogic/Constants.js';
import Resources from './gamelogic/Resources.js';
import * as Tooltip from './Tooltip.js';
import { notOccupied } from './CursorActions.js';


const resourceNames = {
    [Resources.PINE_WOOD]: 'pine wood',
    [Resources.BEECH_WOOD]: 'beech wood',
    [Resources.OAK_WOOD]: 'oak wood',
    [Resources.PINE_SAPLING]: 'pine sapling',
    [Resources.BEECH_SAPLING]: 'beech sapling',
    [Resources.OAK_SAPLING]: 'oak sapling',
    [Resources.FERTILIZER]: 'fertilizer',
};


export function setTileTooltip(entity, gameState) {

    let tooltip = 'full///';
    let hasExplanation = true;

    if(entity.tree) {
        tooltip += getTreeTooltip(entity);

    } else if(entity.pulleyCrane) {
        tooltip += getPulleyCraneTooltip(entity);

    } else if(entity.water) {
        tooltip += getWaterTooltip(entity);

    } else if(entity.treeNursery) {
        tooltip += getTreeNurseryTooltip(entity);

    } else if(entity.forester) {
        tooltip += getForesterTooltip(entity);

    } else if(entity.lumberHut) {
        tooltip += getLumberHutTooltip(entity);

    } else if(entity.sprinkler) {
        tooltip += getSprinklerTooltip(entity);

    } else if(entity.compostHeap) {
        tooltip += getCompostHeapTooltip(entity);

    } else {
        tooltip += 'Barren Land///';
        hasExplanation = false;
    }

    const canBeDemolished = !(entity.water && entity.water.source);
    if(canBeDemolished) {
        if(hasExplanation) {
            tooltip += '===///';
        }
        tooltip += `Pollution: ${  Math.round(entity.pollution)  }%///`;
    }

    tooltip += getClickTooltip(entity, gameState, canBeDemolished);

    Tooltip.set(tooltip);
}


function getTreeTooltip(entity) {
    let tooltip = '';
    if(entity.tree.type === 0) {
        tooltip = 'Pine Tree///';
    } else if(entity.tree.type === 1) {
        tooltip = 'Beech Tree///';
    } else if(entity.tree.type === 2) {
        tooltip = 'Oak Tree///';
    }
    tooltip += `Growth: ${  Math.round(entity.tree.level)  }%///`;
    tooltip += `Health: ${  Math.round(entity.tree.health)  }%///`;
    return tooltip;
}


function getPulleyCraneTooltip(entity) {
    let tooltip = 'Pulley Crane///';
    if(entity.pulleyCrane.orientation === ORIENTATION.NORTH_SOUTH) {
        tooltip += 'Moves items North to South///';
    } else if(entity.pulleyCrane.orientation === ORIENTATION.EAST_WEST) {
        tooltip += 'Moves items East to West///';
    } else if(entity.pulleyCrane.orientation === ORIENTATION.SOUTH_NORTH) {
        tooltip += 'Moves items South to North///';
    } else if(entity.pulleyCrane.orientation === ORIENTATION.WEST_EAST) {
        tooltip += 'Moves items West to East///';
    }
    return tooltip;
}


function getWaterTooltip(entity) {
    let tooltip = '';
    if(entity.water.source) {
        tooltip += 'Natural Water Spring///';
        tooltip += 'Source of all life///';
    } else {
        tooltip += 'Water Canal///';
        tooltip += 'Can carry water and items///';
        tooltip += `Water level: ${  Math.round(entity.water.level)  }%///`;
    }
    return tooltip;
}


function getTreeNurseryTooltip(entity) {
    let tooltip = 'Tree Nursery///';
    tooltip += 'Grows saplings out of wood///';
    tooltip += getInputTooltip(entity, [Resources.PINE_WOOD, Resources.BEECH_WOOD, Resources.OAK_WOOD]);
    tooltip += getOutputTooltip(entity, [Resources.PINE_SAPLING, Resources.BEECH_SAPLING, Resources.OAK_SAPLING]);
    return tooltip;
}


function getForesterTooltip(entity) {
    let tooltip = 'Forester///';
    tooltip += 'Plants saplings in its vicinity///';
    tooltip += getInputTooltip(entity, [Resources.PINE_SAPLING, Resources.BEECH_SAPLING, Resources.OAK_SAPLING]);
    return tooltip;
}


function getLumberHutTooltip(entity) {
    let tooltip = 'Lumber Hut///';
    tooltip += 'Produces wood by Chopping down trees in its vicinity///';
    tooltip += getOutputTooltip(entity, [Resources.PINE_WOOD, Resources.BEECH_WOOD, Resources.OAK_WOOD]);
    return tooltip;
}


function getSprinklerTooltip(entity) {
    let tooltip = 'Sprinkler///';
    tooltip += 'Provides water to trees in its vicinity///';
    tooltip += `Supplied: ${entity.waterConsumer.supplied} ///`;
    return tooltip;
}


function getCompostHeapTooltip(entity) {
    let tooltip = 'Compost Heap///';
    tooltip += 'Produces fertilizer from wood///';
    tooltip += getInputTooltip(entity, [Resources.PINE_WOOD]);
    tooltip += getOutputTooltip(entity, [Resources.FERTILIZER]);
    return tooltip;
}


function getInputTooltip(entity, resources) {

    let tooltip = '===///Input:///';
    for(let res of resources) {
        tooltip += '###';
        tooltip += entity.factory.inputResources[res] ? entity.factory.inputResources[res] : '0';
        tooltip += ` ${  resourceNames[res]  }///`;
    }
    return tooltip;
}


function getOutputTooltip(entity, resources) {
    let tooltip = '===///Output:///';
    for(let res of resources) {
        tooltip += '###';
        tooltip += entity.factory.outputResources[res] ? entity.factory.outputResources[res] : '0';
        tooltip += ` ${  resourceNames[res]  }///`;
    }
    return tooltip;
}


function getClickTooltip(entity, gameState, canBeDemolished) {

    let tooltip = '';

    if(Keyboard.isPressed(Keyboard.SHIFT) || gameState.cursorMode === CURSOR_MODES.PICK) {
        if(entity.item) {
            tooltip += '$$$Click to pick up item';// TODO make differentiation between item
        } else if(entity.factory && entity.factory.outputResourcesLimit > 0) {
            tooltip += '$$$Click to pick up produced resources';// TODO make differentiation between resources
        } else if(entity.tree) {
            tooltip += '$$$Click to chop down';
        }

    } else if(gameState.cursorMode === CURSOR_MODES.DESTROY) {
        if(!canBeDemolished) {
            tooltip += '$$$(Cannot be demolished)';
        } else if(entity.pulleyCrane
            || entity.water
            || entity.treeNursery
            || entity.forester
            || entity.lumberHut
            || entity.sprinkler
            || entity.compostHeap
        ) {
            tooltip += '$$$Click to demolish';
        } else if(entity.tree) {
            tooltip += '$$$Click to chop down';
        }

    } else if(gameState.cursorMode === CURSOR_MODES.DROP) {
        if(entity.water || notOccupied(entity)) {
            tooltip += '$$$Click to dispense item'; // TODO make differentiation between items
        } else if(entity.factory && entity.factory.requiredResources[gameState.selectedResource]) {
            tooltip += '$$$Click to dispense item into building'; // TODO make differentiation between items
        }


    } else if(gameState.cursorMode === CURSOR_MODES.BUILD) {
        if(notOccupied(entity)) {
            tooltip += '$$$Click to build building'; // TODO make differentiation between buildings
        }
    }

    return tooltip;
}