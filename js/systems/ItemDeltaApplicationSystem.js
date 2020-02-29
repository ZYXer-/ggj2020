import { newItem } from '../components/Item.js';

/*
Applies changes in item
 */


//TODO: Solve hacky solution of item delta handling: Handle cases for item delta > 1 and to prevent deltas
// for more than 1 type

export function apply(entity)  {
    if (entity.itemDelta) {
        const keys = Object.keys(entity.itemDelta);

        if (keys.length === 0) {
            return;
        }
        else if (keys.length > 1) {
            console.warn('Delta for more than 1 item type is not supported!!!');
        }

        const key = keys[0];
        if (entity.itemDelta[key] > 0) {
            entity.item = newItem(key, entity);
            console.log('item added');
        } else if (key && entity.itemDelta[key] < 0) {
            entity.item = null;
        }
        entity.itemDelta = {};
    }
}