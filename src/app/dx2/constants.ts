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
  'Avian',
  'Deity',
  'Avatar',
  'Holy',
  'Genma',
  'Fury',
  'Dragon',
  'Lady',
  'Kishin',
  'Divine',
  'Yoma',
  'Snake',
  'Beast',
  'Fairy',
  'Jirae',
  'Jaki',
  'Fallen',
  'Brute',
  'Femme',
  'Night',
  'Vile',
  'Raptor',
  'Wood',
  'Wilder',
  'Foul',
  'Tyrant',
  'Drake',
  'Haunt',
  'Fiend',
  'Hero',
  'Reaper',
  'General',
  'Undead',
  'Tenma',
  'Witch',
  'Powers',
  'Unknown', 
  'Cyborg', 
  'Machine', 
  'Seraph',
  'Mitama',
  'Rumor',
  'UMA',
  'Entity',
  'Enigma',
  'Zealot'
];

export const ResistanceElements = [
  'phy',
  'fir',
  'ice',
  'ele',
  'for',
  'lig',
  'dar'
];

export const SkillElements = ResistanceElements.concat(
  'alm',
  'ail',
  'rec',
  'sup',
  'pas'
);

export const BaseStats = [
  '★', 'HP', 'St', 'Ma', 'Vi', 'Ag', 'Lu', 'No', 'Pa'
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
export const APP_TITLE = 'Shin Megami Tensei: Liberation Dx2';
