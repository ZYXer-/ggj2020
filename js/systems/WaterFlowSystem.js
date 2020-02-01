export function apply(entity) {
    if (entity.water === undefined) { return }

    const waterSuppliers = entity.hood1.filter(e => e.water);
    waterSuppliers.forEach(waterSupplier => {
        const levelDelta = waterSupplier.water.level - entity.water.level;
        if (levelDelta > 0) {
            entity.water.delta += levelDelta * 0.25;
            waterSupplier.water.delta -= levelDelta * 0.25;
        }
    });
}