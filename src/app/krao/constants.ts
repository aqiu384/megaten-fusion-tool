import { NormalFusionCalculator } from '../compendium/models/normal-fusion-calculator';

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
  'Skill',
  'Element',
  'Spirit',
  'Fiend',
  'Evil'
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
  'investigate',
  'boss'
);

export const BaseStats = [
  'HP', 'St', 'Ma', 'Vi', 'Lu'
];

export const ElementDemons = [
  'Erthys', 'Aeros', 'Aquans', 'Flaemis', 'Sylph', 'Undine'
];

export const RaceOrder = getEnumOrder(Races);
export const ElementOrder = getEnumOrder(SkillElements);

export const FUSION_SETTINGS_KEY = 'krao-fusion-tool-settings';
export const FUSION_SETTINGS_VERSION = 1709211400;
export const APP_TITLE = 'Raidou Kuzunoha vs. King Abaddon';
