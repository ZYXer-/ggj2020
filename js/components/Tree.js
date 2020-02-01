import { rand } from "../utils/Utils.js";


export function newTree() {
    return {
        type: rand(0, 1), // 0 = pine, 1 = beech, 2 = oak
        level: 0, // 0 - 100
    }
}