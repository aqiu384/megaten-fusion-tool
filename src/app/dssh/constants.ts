import { NormalFusionCalculator } from '../compendium/models/normal-fusion-calculator';

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
  'Enigma',
  'Entity',
  'Fury',
  'Lady',
  'Kishin',
  'Vile',
  'Reaper',
  'Zealot',
  'Genma',
  'Yoma',
  'Fairy',
  'Night',
  'Tyrant',
  'Herald',
  'Divine',
  'Fallen',
  'Dragon',
  'Snake',
  'Drake',
  'Avian',
  'Flight',
  'Raptor',
  'Avatar',
  'Holy',
  'Beast',
  'UMA',
  'Wilder',
  'Jirae',
  'Brute',
  'Femme',
  'Jaki',
  'Element',
  'Mitama',
  'Haunt',
  'Spirit',
  'Undead',
  'Tree',
  'Wood',
  'Foul',
  'Rumor',
  'Hero',
  'General',
  'Zoma',
  'Ranger'
];

export const ResistanceElements = [
  'strike',
  'slash',
  'skill',
  'gun',
  'fire',
  'ice',
  'elec',
  'force',
  'expel',
  'death',
  'mind',
  'nerve',
  'curse'
];

export const SkillElements = ResistanceElements.concat(
  'almighty',
  'recovery',
  'support',
  'special',
  'temp',
  'dark',
  'witch',
  'reca',
  'recb',
  'element',
  'hero',
  'none'
);

export const BaseStats = [
  'HP', 'MP', 'St', 'In', 'Ma', 'Vi', 'Ag', 'Lu'
];

export const ElementDemons = [
  'Gnome', 'Sylph', 'Undine', 'Salamander'
];

export const RaceOrder = getEnumOrder(Races);
export const ElementOrder = getEnumOrder(SkillElements);

export const FUSION_SETTINGS_KEY = 'krao-fusion-tool-settings';
export const FUSION_SETTINGS_VERSION = 1709211400;
export const APP_TITLE = 'Devil Summoner: Soul Hackers';
