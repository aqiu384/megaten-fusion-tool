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
  'Summoner'
];

export const ResistanceElements = [
  'phy',
  'fir',
  'ice',
  'ele',
  'for',
  'cur',
  'ner',
  'min',
  'exp',
  'dea'
];

export const SpecialResistances = {
  'all': ResistanceElements,
  'mag': [ 'fir', 'ice', 'ele', 'for' ],
  'ail': [ 'cur', 'ner', 'min' ]
};

export const SkillElements = ResistanceElements.concat(
  'alm',
  'rec',
  'sup',
  'spe',
  'pas',
  'tal'
);

export const BaseStats = [
  'hp', 'mp', 'st', 'ma', 'vi', 'ag', 'lu'
];

export const ResistanceLevels = [
  'wk', 'no', 'rs', 'nu', 'rp', 'dr'
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

export const FUSION_SETTINGS_KEY = 'smt3-fusion-tool-settings';
export const FUSION_SETTINGS_VERSION = 1709211400;
export const APP_TITLE = 'Shin Megami Tensei III: Nocturne';
