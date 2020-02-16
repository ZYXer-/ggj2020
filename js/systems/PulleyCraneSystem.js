import { PULLEY_CRANE_STATUS } from "../components/PulleyCrane.js";
import {ORIENTATION} from "../gamelogic/Constants.js";
import { multiplyResources, subtractResources } from "../gamelogic/Resources.js";

export function apply(entity) {
    if (entity.pulleyCrane) {
        if (entity.pulleyCrane.status === PULLEY_CRANE_STATUS.READY && entity.pulleyCrane.item === null) {
            const demand = computeDemand(entity);

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

function getSourceTile(entity) {
    switch (entity.pulleyCrane.orientation) {
        case ORIENTATION.NORTH_SOUTH:
            return getNorthTile(entity);
        case ORIENTATION.EAST_WEST:
            return getEastTile(entity);
        case ORIENTATION.SOUTH_NORTH:
             return getSouthTile(entity);
        case ORIENTATION.WEST_EAST:
             return getWestTile(entity);
    }
}

function getSinkTile(entity) {
    switch (entity.pulleyCrane.orientation) {
        case ORIENTATION.NORTH_SOUTH:
            return getSouthTile(entity);
        case ORIENTATION.EAST_WEST:
            return getWestTile(entity);
        case ORIENTATION.SOUTH_NORTH:
            return getNorthTile(entity);
        case ORIENTATION.WEST_EAST:
            return getEastTile(entity);
    }
}

function computeDemand(entity) {
    const sink = getSinkTile(entity);
    if (sink.factory) {
        const demand = Object.assign({}, sink.factory.requiredResources);
        multiplyResources(demand, 2);
        subtractResources(demand, sink.factory.inputResources);
        return Object.entries(demand).filter(([_, value]) => value > 0).map(([key, _]) => key);
    }
    return null;
}


function grabItem(entity) {
    const sourceTile = getSourceTile(entity);

    if (sourceTile && sourceTile.item && (sourceTile.itemDelta[sourceTile.item] || 0) >= 0) {
        entity.pulleyCrane.item =  sourceTile.item.type;
        sourceTile.itemDelta[sourceTile.item] = (sourceTile.itemDelta[sourceTile.item] || 0) - 1;
    }
}

function dropItem(entity) {
    var sinkTile = getSinkTile(entity);

    if (sinkTile && !sinkTile.item &&  Object.keys(sinkTile.itemDelta).length === 0)  {
        sinkTile.itemDelta[entity.pulleyCrane.item] = (sinkTile.itemDelta[entity.pulleyCrane.item] || 0) + 1;
        entity.pulleyCrane.item = null;
    }
}