export default {
    PINE_WOOD: 'PineWood',
    BEECH_WOOD: 'BeechWood',
    OAK_WOOD: 'OakWood',
    PINE_SAPLING: 'PineSapling',
    BEECH_SAPLING: 'BeechSapling',
    OAK_SAPLING: 'OakSapling',
    PLANTBLE_PINE_SAPLING: 'PlantablePineSapling',
    FERTILIZER: 'Fertilizer',
    TREE_CUT_ACTION: 'TreeCutAction',
}

//TODO: Make resources operations immutable, maybe use vectors for them

export function checkResourceAvailability(resourceSupply, requiredResources, multiplier = 1) {
    for (let [key, value] of Object.entries(requiredResources)) {

        if (!(resourceSupply[key] >= value * multiplier) && value !== 0) { //value === 0 used to fake factories that don't need any resources
            return false;
        }
    }
    return true;
}

export function subtractResources(resourceSupply, resources) {
    for (let [key, value] of Object.entries(resources)) {
        resourceSupply[key] = (resourceSupply[key] || 0) - value;
    }
}

export function addResources(resourceSupply, resources) {
    for (let [key, value] of Object.entries(resources)) {
        resourceSupply[key] = (resourceSupply[key] || 0) + value;
    }
}

export function multiplyResources(resources, factor) {
    for (let key of Object.keys(resources)) {
        resources[key] *= (resources[key] || 0) * factor;
    }
}
