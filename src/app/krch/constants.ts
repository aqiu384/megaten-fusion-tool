import { NormalFusionCalculator } from '../compendium/models/normal-fusion-calculator';
import { fuseWithDiffRace, fuseWithSameRace, fuseWithElement } from '../compendium/fusions/smt-nonelem-fusions';
import { splitWithDiffRace, splitWithElement } from '../compendium/fusions/smt-nonelem-fissions';

function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

export const Races = [
  'Pyro',
  'Frost',
  'Volt',
  'Wind',
  'Fury',
  'Pagan',
  'Skill'
];

export const ResistanceElements = [
  'phys',
  'gun',
  'fire',
  'ice',
  'elec',
  'force',
  'death',
  'mind'
];

export const SkillElements = ResistanceElements.concat(
  'almighty',
  'recovery',
  'support',
  'passive',
  'investigate'
);

export const BaseStats = [
  'HP', 'MP', 'MG', 'St', 'Ma', 'Vi', 'Lu'
];

export const FUSION_CALCULATOR = new NormalFusionCalculator(
  [ fuseWithDiffRace ],
  []
);

export const FISSION_CALCULATOR = new NormalFusionCalculator(
  [ splitWithDiffRace ],
  []
);

export const RaceOrder = getEnumOrder(Races);
export const ElementOrder = getEnumOrder(SkillElements);

export const FUSION_SETTINGS_KEY = 'krch-fusion-tool-settings';
export const FUSION_SETTINGS_VERSION = 1709211400;
export const APP_TITLE = 'Raidou Kuzunoha vs. The Soulless Army';
