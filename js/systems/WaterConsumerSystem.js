export function apply(entity) {
    if (entity.waterConsumer) {
        const waterSuppliers = entity.hood1.filter(e => e.water && e.water.flow > entity.waterConsumer.consumption);
        if (waterSuppliers.length > 0) {
            const waterSupplier = waterSuppliers[0];
            waterSupplier.water.flow -= entity.waterConsumer.consumption;
            entity.waterConsumer.supplied = true;
        } else {
            entity.waterConsumer.supplied = false;
        }
    }
}