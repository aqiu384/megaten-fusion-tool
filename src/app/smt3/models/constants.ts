function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

export const Races = [
  'Deity',
  'Megami',
  'Fury',
  'Lady',
  'Kishin',
  'Holy',
  'Yoma',
  'Fairy',
  'Divine',
  'Fallen',
  'Snake',
  'Beast',
  'Jirae',
  'Brute',
  'Femme',
  'Vile',
  'Tyrant',
  'Night',
  'Wilder',
  'Haunt',
  'Foul',
  'Seraph',
  'Wargod',
  'Genma',
  'Dragon',
  'Avatar',
  'Avian',
  'Raptor',
  'Entity',
  'Fiend',
  'Element',
  'Mitama',
  'D-Fiend',
  'Summoner',
  'Magatama'
];

export const ResistanceElements = [
  'phy',
  'fir',
  'ice',
  'ele',
  'for',
  'exp',
  'dea',
  'min',
  'ner',
  'cur'
];

export const SkillElements = ResistanceElements.concat(
  'alm',
  'rec',
  'sup',
  'spe',
  'pas',
  'tal'
);

export const BaseStats = [
  'HP', 'MP', 'St', 'Ma', 'Vi', 'Ag', 'Lu'
];

export const ResistanceLevels = [
  'wk', 'no', 'rs', 'nu', 'rp', 'dr'
];

export const ResistCodes = {
  w: 1125,
  '-': 100,
  s: 50,
  n: 0,
  r: -100,
  d: -1100
};

export const InheritElements = [
  'Thrust',
  'Claw',
  'Bite',
  'Weapon',
  'Mouth',
  'Wings',
  'Eye',
  'Talk',
  'Maiden'
];

export const ElementDemons = [
  'Erthys',
  'Aeros',
  'Aquans',
  'Flaemis'
];

export const RaceOrder = getEnumOrder(Races);
export const ElementOrder = getEnumOrder(SkillElements);
export const ResistanceOrder = getEnumOrder(ResistanceLevels);
export const InheritElementOrder = getEnumOrder(InheritElements.concat('None'));

export const FUSION_SETTINGS_KEY = 'smt3-fusion-tool-settings';
export const FUSION_SETTINGS_VERSION = 1709211400;
export const APP_TITLE = 'Shin Megami Tensei III: Nocturne';
