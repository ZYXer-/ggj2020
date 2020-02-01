export function newFactory() {
    return {
        inputResources: {},
        // inStockLimit: 1,
        outStock: {},
        outStockLimit: 1,
        requiredResources: {},
        productionTime: 1,
        productionProgress: 0,
        outputResources: {},
    };
}