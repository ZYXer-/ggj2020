	// Tree damage: Fully grown pine can't survive alone
// Tree in low polluted areas get healed
// Tree in high polluted areas get damaged

import Resources from './Resources.js';

export const TREE_POLLUTION_REDUCTION_FACTOR = 0.012; // Tree's pollution reduction relative to the level of the tree
export const TREE_POLLUTION_REDUCTION_DISTANCE_FACTOR = 0.30; // Tree's pollution reduction relative to the tree's distance to a polluted tile
export const TREE_POLLUTION_REDUCTION_CHANCE = 0.45; // Chance that a tree decreases the pollution of a field
export const POLLUTION_DIFFUSION = 0.025; // Diffusion factor of pollution `(polluter.pollution - entity.pollution) * factor`
export const POLLUTION_REDUCTION = 0.25; // General decrease of pollution

export const TREE_RECOVERY_RATE = 1;
export const POLLUTION_DAMAGE_FACTOR = 0.25;
export const FERTILIZER_GROWTH_BOOST = 2;
export const FERTILIZER_USAGE_RATE = 0.1;
export const TREENURCERY_COST = { [Resources.PINE_WOOD]: 75};
export const TREENURCERY_COOL_DOWN = 5;
export const TREENURCERY_INPUT_RECOURCES_LIMIT = 5;
export const TREENURCERY_INPUT_RECOURCES = 2;
export const COMPOST_HEAP_COST = { [Resources.PINE_WOOD]: 10};
export const COMPOST_HEAP_INPUT_RECOURCES = 2;
export const COMPOST_HEAP_COOL_DOWN = 5;
export const COMPOST_HEAP_INPUT_RECOURCES_LIMIT = 2;
export const PULLYCRANE_COST = 10;
export const FORESTER_COST = { [Resources.PINE_WOOD]: 60};
export const FORESTER_COOL_DOWN = 5;
export const FORESTER_INPUT_RECOURCES = 1;
export const FORESTER_INPUT_RECOURCES_LIMIT = 2;
export const SPRINKLER_COST = { [Resources.PINE_WOOD]: 90};
export const SPRINKLER_WATER_CONSUMPTION = 1;
export const LUMBERHUT_COST = { [Resources.PINE_WOOD]: 50};
export const LUMBER_HUT_COOL_DOWN = 5;
export const WATER_COST = { [Resources.PINE_WOOD]: 10};

export const MAX_POLLUTION_VALUE = 100;
export const MAX_TREE_LEVEL = 100;
