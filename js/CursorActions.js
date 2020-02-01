import * as Entities from "./Entities.js";
import * as Mouse from "./core/input/Mouse.js";
import Vec2 from "./utils/Vec2.js";
import * as DrawSystem from "./systems/DrawSystem.js";
import { newTree } from "./components/Tree.js";
import { newDisplay } from "./components/Display.js";
import { newFactory } from "./components/Factory.js";
import Resources from "./utils/Resources.js";


function toTileCoordinates(position) {
    return new Vec2(
        Math.floor(position.x / DrawSystem.TILE_SIZE),
        Math.floor(position.y / DrawSystem.TILE_SIZE),
    );
}

function getCursorTile() {
    return Entities.getTileByCoordinates(toTileCoordinates(Mouse.pos));
}

export function PlaceWater() {
    const tile = getCursorTile();
    if (!tile.tree) {
        if (tile.water) {
            delete tile.water;
        } else {
            tile.water = {
                source: false,
                level: 0,
                delta: 0,
            };
        }
    }
}

export function PlaceTree() {
    const tile = getCursorTile();
    if (!tile.water && !tile.tree) {
        tile.tree = newTree();
        tile.display = newDisplay();
    }
}

export function PlaceTreeNursery() {
    const tile = getCursorTile();
    if (!tile.water && !tile.tree && !tile.factory) {
       tile.factory = newFactory(); // TODO: Add parameter
       tile.factory.requiredResources[Resources.PINE_WOOD] = 1;
       tile.factory.productionTime = 10;
       tile.factory.outputResources[Resources.PINE_SAPLING] = 1;
    }
}

export function CutTree(gameState) {
    const tile = getCursorTile();

    if (tile.tree) {
        switch (tile.tree.type) {
            case 0:
                if (tile.tree.level === 100) {
                    gameState.pineWood += 15;
                } else {
                    gameState.pineWood += Math.floor(tile.tree.level / 10);
                }
                break;
            case 1:
                if (tile.tree.level === 100) {
                    gameState.beechWood += 15;
                } else {
                    gameState.beechWood += Math.floor(tile.tree.level / 10);
                }
                break;
            case 2:
                if (tile.tree.level === 100) {
                    gameState.oakWood += 15;
                } else {
                    gameState.oakWood += Math.floor(tile.tree.level / 10);
                }
                break;
        }
        delete tile.tree;
    }
}

export const List = [
    PlaceTree,
    PlaceWater,
    CutTree,
    PlaceTreeNursery,
]
