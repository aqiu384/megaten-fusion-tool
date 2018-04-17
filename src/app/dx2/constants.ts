function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

export const Races = [
  'Herald',
  'Megami',
  'Deity',
  'Avatar',
  'Holy',
  'Genma',
  'Fury',
  'Lady',
  'Kishin',
  'Divine',
  'Yoma',
  'Snake',
  'Beast',
  'Fairy',
  'Fallen',
  'Brute',
  'Femme',
  'Night',
  'Vile',
  'Wilder',
  'Foul',
  'Tyrant',
  'Haunt',
  'Avian',
  'Fiend',
  'Hero',
  'Rumor',
  'UMA',
  'Enigma',
  'Zealot'
];

export const ResistanceElements = [
  'phys',
  'fire',
  'ice',
  'elec',
  'force',
  'expel',
  'death'
];

export const SkillElements = ResistanceElements.concat(
  'ailment',
  'recovery',
  'almighty',
  'support',
  'passive'
);

export const BaseStats = [
  '★', 'HP', 'St', 'Ma', 'Vi', 'Ag', 'Lu'
];

export const ResistCodes = {
  w: 1125,
  '-': 100,
  s: 50,
  n: 0,
  r: -100,
  d: -1100
};

export const RaceOrder = getEnumOrder(Races);
export const SkillElementOrder = getEnumOrder(SkillElements);

export const VAN_FUSION_SETTINGS_KEY = 'dx2-fusion-tool-settings';
export const FUSION_SETTINGS_VERSION = 1709211400;
export const APP_TITLE = 'Dx2 Shin Megami Tensei: Liberation';
