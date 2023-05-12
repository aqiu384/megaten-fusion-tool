import { InjectionToken } from '@angular/core';
import { CompendiumConfig, FusionDataService, FusionTrioService } from './models';

import { NormalFusionCalculator } from './models/normal-fusion-calculator';
import { fuseWithDiffRace, fuseWithSameRace, fuseWithElement } from './fusions/smt-nonelem-fusions';
import { fuseWithNormResult, fuseWithSpecResult, fuseTwoElements } from './fusions/smt-element-fusions';
import { splitWithDiffRace, splitWithSpecies, splitWithElement, splitWithTotem } from './fusions/smt-nonelem-fissions';
import { splitElement } from './fusions/smt-element-fissions';

import { splitWithDarkRace, fuseWithDarkRace } from './fusions/snes-dark-fusions';

import { fuseWithSameRace as perFuseSame } from './fusions/per-nonelem-fusions';
import { splitWithSameRace as perSplitSame } from './fusions/per-nonelem-fissions';

import { TripleFusionCalculator } from './models/triple-fusion-calculator';
import {
  fuseT1WithDiffRace as fuse3T1,
  fuseN1WithDiffRace as fuse3N1,
  fuseWithSameRace as fuse3SR
} from './fusions/per-triple-fusions';
import {
  splitWithDiffRace as split3DR,
  splitWithSameRace as split3SR,
  splitWithPrevLvl as split3PL
} from './fusions/per-triple-fissions';

export const COMPENDIUM_CONFIG = new InjectionToken<CompendiumConfig>('compendium.config');
export const FUSION_DATA_SERVICE = new InjectionToken<FusionDataService>('fusion.data.service');
export const FUSION_TRIO_SERVICE = new InjectionToken<FusionTrioService>('fusion.trio.service');

export const SMT_NORMAL_FUSION_CALCULATOR = new NormalFusionCalculator(
  [ fuseWithDiffRace, fuseWithSameRace, fuseWithElement ],
  [ fuseWithNormResult, fuseWithSpecResult, fuseTwoElements ]
);

export const SMT_NES_NORMAL_FUSION_CALCULATOR = new NormalFusionCalculator(
  [ fuseWithDiffRace, fuseWithSameRace, fuseWithElement, fuseWithDarkRace ],
  [ fuseWithNormResult, fuseWithSpecResult, fuseTwoElements ]
);

export const SMT_NORMAL_FISSION_CALCULATOR = new NormalFusionCalculator(
  [ splitWithDiffRace, splitWithSpecies, splitWithElement, splitWithTotem ],
  [ splitElement ]
);

export const SMT_NES_NORMAL_FISSION_CALCULATOR = new NormalFusionCalculator(
  [ splitWithDiffRace, splitWithSpecies, splitWithElement, splitWithDarkRace ],
  [ splitElement ]
);

export const P3_NORMAL_FUSION_CALCULATOR = new NormalFusionCalculator(
  [ fuseWithDiffRace, perFuseSame ],
  [ ]
);

export const P3_NORMAL_FISSION_CALCULATOR = new NormalFusionCalculator(
  [ splitWithDiffRace, perSplitSame ],
  [ ]
);

export const P3_TRIPLE_FUSION_CALCULATOR = new TripleFusionCalculator(
  [ fuse3T1, fuse3N1, fuse3SR ],
  [ ]
);

export const P3_TRIPLE_FISSION_CALCULATOR = new TripleFusionCalculator(
  [ split3DR, split3SR, split3PL ],
  [ ]
);

function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

export const ResistanceLevels = [
  'wk', 'no', 'rs', 'st', 'nu', 'rp', 'dr', 'ab'
];

export const ResistOrder = getEnumOrder(ResistanceLevels);
