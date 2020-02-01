export default {
    PINE_WOOD: 'PineWood',
    PINE_SAPLING: 'PineSapling',
    COMPOST: 'Compost',
}

export function checkResourceAvailability(resourceSupply, requiredResources, multiplier = 1) {
    for (let [key, value] of Object.entries(requiredResources)) {
        if (!(resourceSupply[key] >= value * multiplier)) {
            return false;
        }
    }
    return true;
}

export function removeResources(resourceSupply, resources) {
    for (let [key, value] of Object.entries(resources)) {
        resourceSupply[key] = (resourceSupply[key] || 0) - value;
    }
}

export function addResources(resourceSupply, resources) {
    for (let [key, value] of Object.entries(resources)) {
        resourceSupply[key] = (resourceSupply[key] || 0) + value;
    }
}