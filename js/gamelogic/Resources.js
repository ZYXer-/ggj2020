export default {
    PINE_WOOD: 'PineWood',
    PINE_SAPLING: 'PineSapling',
}

export function checkResourceAvailability(gameState, requiredResources, multiplier = 1) {
    for (let [key, value] of Object.entries(requiredResources)) {
        if (gameState[key] < value * multiplier) {
            return false;
        }
    }
    return true;
}

export function removeResources(resourceSupply, resources) {
    for (let [key, value] of Object.entries(resources)) {
        resourceSupply[key] -= value;
    }
}

export function addResources(resourceSupply, resources) {
    for (let [key, value] of Object.entries(resources)) {
        resourceSupply[key] += value;
    }
}