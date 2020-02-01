import * as Entities from "./Entities.js";
import * as Mouse from "./core/input/Mouse.js";
import Vec2 from "./utils/Vec2.js";
import * as DrawSystem from "./systems/DrawSystem.js";
import { newTree } from "./components/Tree.js";
import { newDisplay } from "./components/Display.js";

function toTileCoordinates(position) {
    return new Vec2(
        Math.floor(position.x / DrawSystem.TILE_SIZE),
        Math.floor(position.y / DrawSystem.TILE_SIZE),
    );
}

function getCursorTile() {
    return Entities.getTileByCoordinates(toTileCoordinates(Mouse.pos));
}

export function placeWater() {
    const tile = getCursorTile();
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

export function placeTree() {
    const tile = getCursorTile();
    if (!tile.water) {
        tile.tree = newTree();
        tile.display = newDisplay();
    }
}
