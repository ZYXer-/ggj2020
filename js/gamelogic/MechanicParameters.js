// Tree damage: Fully grown pine can't survive alone
// Tree in low polluted areas get healed
// Tree in high polluted areas get damaged

import Resources from './Resources.js';

export const TREE_POLLUTION_REDUCTION_FACTOR = 0.012; // Tree's pollution reduction relative to the level of the tree
export const TREE_POLLUTION_REDUCTION_DISTANCE_FACTOR = 0.30; // Tree's pollution reduction relative to the tree's distance to a polluted tile
export const TREE_POLLUTION_REDUCTION_CHANCE = 0.45; // Chance that a tree decreases the pollution of a field
export const MIN_POLLUTION_GROWTH = 0.3; // Minimum value a tiles pollution grows, when a growth happens

export const TREE_RECOVERY_RATE = 1;
export const POLLUTION_DAMAGE_FACTOR = 0.25;
export const FERTILIZER_GROWTH_BOOST = 2;
export const FERTILIZER_USAGE_RATE = 0.1;
export const COMPOST_COST = 10;
export const SPRINKLER_COST = 100;
export const SPRINKLER_WATER_CONSUMPTION = 1;
export const LUMBER_HUT_COOL_DOWN = 5;
export const WATER_COST = { [Resources.PINE_WOOD]: 10};

export const MAX_POLLUTION_VALUE = 100;
export const MAX_TREE_LEVEL = 100;