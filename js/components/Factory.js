export function newFactory() {
    return {
        inputResources: {},
        inputResourcesLimit: 1, // You are allowed to add the resources for that many copies of the requiredResources
        outputResources: {},
        outputResourcesLimit: 1,
        requiredResources: {},
        productionTime: 1,
        productionProgress: 0,
        producedResource: undefined,
    };
}