import { clamp } from "../utils/Utils.js";

const MAX_TREE_LEVEL = 100;

export function apply(entity) {
    if (entity.tree) {
        entity.tree.level = clamp(entity.tree.level + 1, 0, MAX_TREE_LEVEL);
    }
}