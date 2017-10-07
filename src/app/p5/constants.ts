import { NormalFusionCalculator } from '../compendium/models/normal-fusion-calculator';

import { fuseWithDiffRace, fuseWithElement } from '../compendium/fusions/smt-nonelem-fusions';
import { fuseWithSameRace } from '../compendium/fusions/per-nonelem-fusions';
import { fuseWithNormResult, fuseWithSpecResult } from '../compendium/fusions/smt-element-fusions';
import { fuseTwoElements } from '../compendium/fusions/per-element-fusions';

import { splitWithDiffRace } from '../compendium/fusions/smt-nonelem-fissions';
import { splitWithSameRace, splitWithElement } from '../compendium/fusions/per-nonelem-fissions';

export const P5_NORMAL_FUSION_CALCULATOR = new NormalFusionCalculator(
  [ fuseWithDiffRace, fuseWithSameRace, fuseWithElement ],
  [ fuseWithNormResult, fuseWithSpecResult, fuseTwoElements ]
);

export const P5_NORMAL_FISSION_CALCULATOR = new NormalFusionCalculator(
  [ splitWithDiffRace, splitWithSameRace, splitWithElement ],
  [ ]
);
