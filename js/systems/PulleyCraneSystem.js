import { PULLEY_CRANE_STATUS } from "../components/PulleyCrane.js";
import {ORIENTATION} from "../gamelogic/Constants.js";

export function apply(entity) {
    if (entity.pulleyCrane) {
        if (entity.pulleyCrane.status === PULLEY_CRANE_STATUS.READY && entity.pulleyCrane.item === null) {
            grabItem(entity);
            if (entity.pulleyCrane.item) {
                entity.pulleyCrane.status = PULLEY_CRANE_STATUS.LOADED;
            }
        } else if (entity.pulleyCrane.status === PULLEY_CRANE_STATUS.LOADED) {
            dropItem(entity);
            if (!entity.pulleyCrane.item) {
                entity.pulleyCrane.status = PULLEY_CRANE_STATUS.REWIND;
            }
        } else if (entity.pulleyCrane.status === PULLEY_CRANE_STATUS.REWIND) {
            entity.pulleyCrane.status = PULLEY_CRANE_STATUS.READY;
        }
    }
}

function getNorthTile(tile) {
    return tile.hood1.filter(t => t.position.x === tile.position.x && t.position.y < tile.position.y)[0];
}

function getSouthTile(tile) {
    return tile.hood1.filter(t => t.position.x === tile.position.x && t.position.y > tile.position.y)[0];
}

function getWestTile(tile) {
    return tile.hood1.filter(t => t.position.x < tile.position.x && t.position.y === tile.position.y)[0];
}

function getEastTile(tile) {
    return tile.hood1.filter(t => t.position.x > tile.position.x && t.position.y === tile.position.y)[0];
}

function grabItem(entity) {
    var sourceTile;
    switch (entity.pulleyCrane.orientation) {
        case ORIENTATION.NORTH_SOUTH:
            sourceTile = getNorthTile(entity);
            break;
        case ORIENTATION.EAST_WEST:
            sourceTile = getEastTile(entity);
            break;
        case ORIENTATION.SOUTH_NORTH:
            sourceTile = getSouthTile(entity);
            break;
        case ORIENTATION.WEST_EAST:
            sourceTile = getWestTile(entity);
            break;
    }

    if (sourceTile && sourceTile.item && (sourceTile.itemDelta[sourceTile.item] || 0) >= 0) {
        entity.pulleyCrane.item =  sourceTile.item.type;
        sourceTile.itemDelta[sourceTile.item] = (sourceTile.itemDelta[sourceTile.item] || 0) - 1;
    }
}

function dropItem(entity) {
    var sinkTile;
    switch (entity.pulleyCrane.orientation) {
        case ORIENTATION.NORTH_SOUTH:
            sinkTile = getSouthTile(entity);
            break;
        case ORIENTATION.EAST_WEST:
            sinkTile = getWestTile(entity);
            break;
        case ORIENTATION.SOUTH_NORTH:
            sinkTile = getNorthTile(entity);
            break;
        case ORIENTATION.WEST_EAST:
            sinkTile = getEastTile(entity);
            break;
    }

    if (sinkTile && !sinkTile.item &&  Object.keys(sinkTile.itemDelta).length === 0)  {
        sinkTile.itemDelta[entity.pulleyCrane.item] = (sinkTile.itemDelta[entity.pulleyCrane.item] || 0) + 1;
        entity.pulleyCrane.item = null;
    }
}
