import { rand } from '../utils/Utils.js';

const MAX_TREE_HEALTH = 100;

export function newTree(type, level) {
    return {
        type, // 0 = pine, 1 = beech, 2 = oak
        level, // 0 - 100
        health: MAX_TREE_HEALTH,
    };
}