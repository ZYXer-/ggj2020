import { PULLEY_CRANE_STATUS } from "../components/PulleyCrane.js";
import {ORIENTATION} from "../gamelogic/Constants.js";
import { multiplyResources, subtractResources, addResources } from "../gamelogic/Resources.js";
import Resources from "../gamelogic/Resources.js";

export function apply(entity) {
    if (entity.pulleyCrane) {
        if (entity.pulleyCrane.status === PULLEY_CRANE_STATUS.READY && !entity.pulleyCrane.item) {
            const demand = computeDemand(entity);

            grabItem(entity, demand);
            if (entity.pulleyCrane.item) {
                console.log("Grabbed: " + entity.pulleyCrane.item);
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

function getSourceEntity(entity) {
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

function getSinkEntity(entity) {
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
    const sink = getSinkEntity(entity);
    if (sink.factory) {
        const demand = Object.assign({}, sink.factory.requiredResources);
        multiplyResources(demand, 2);
        subtractResources(demand, sink.factory.inputResources);
        return Object.entries(demand).filter(([_, value]) => value > 0).map(([key, _]) => key);
    }
    return null;
}

function computeSupply(factory) {
    return Object.entries(factory.outputResources)
        .filter(([key, _]) => key !== Resources.PLANTBLE_PINE_SAPLING && key !== Resources.TREE_CUT_ACTION) // TODO: This filtering should not happen here. Probably these virtual resources should not be treated as regular output resources
        .filter(([_, value]) => value > 0)
        .map(([key, _]) => key);
}

function grabItem(entity, demand) {
    const sourceTile = getSourceEntity(entity);

    if (!sourceTile) {
        return;
    }
    if (sourceTile.factory) {
        const supplies = computeSupply(sourceTile.factory);
        // TODO: clean up code, create helpers that filters for resources of size > 0
        if (demand) { // Pick specific item
            for (const supply of supplies) {
                if(demand.find(e => e === supply)) {
                    entity.pulleyCrane.item = supply;
                    subtractResources(sourceTile.factory.outputResources, { [supply]: 1 });
                    return;
                }
            }
        } else {
            if (supplies && supplies.length > 0) {
                const supplyType = supplies[0];
                entity.pulleyCrane.item = supplyType;
                subtractResources(sourceTile.factory.outputResources, { [supplyType]: 1 });
            }
        }
    } else if (sourceTile.item && (sourceTile.itemDelta[sourceTile.item] || 0) >= 0) {
        if (demand) {
            if(!demand.find(e => e === sourceTile.item.type)) {
                return;
            }
        }
        entity.pulleyCrane.item = sourceTile.item.type;
        sourceTile.itemDelta[sourceTile.item] = (sourceTile.itemDelta[sourceTile.item] || 0) - 1;
    }
}

function dropItem(entity) {
    var sinkTile = getSinkEntity(entity);
    if (!sinkTile) {
        return;
    }
    if (sinkTile.factory) {
        const demand = computeDemand(entity);
        if (demand) {
            if(!demand.find(e => e === entity.pulleyCrane.item)) {
                return;
            }
        }
        addResources(sinkTile.factory.inputResources, { [entity.pulleyCrane.item]: 1 });
        entity.pulleyCrane.item = null;
    } else if(!sinkTile.item &&  Object.keys(sinkTile.itemDelta).length === 0)  {
        sinkTile.itemDelta[entity.pulleyCrane.item] = (sinkTile.itemDelta[entity.pulleyCrane.item] || 0) + 1;
        entity.pulleyCrane.item = null;
    }
}
