function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

export const Races = [
  "DEITIES",
  "Deity",
  "Megami",
  "ICONS",
  "Tenma",
  "Kishin",
  "Femme",
  "Vile",
  "NETHERS",
  "Tyrant",
  "Yoma",
  "Night",
  "Fairy",
  "AERIALS",
  "Seraph",
  "Divine",
  "Fallen",
  "DRAGONS",
  "Dragon",
  "Snake",
  "Drake",
  "AVIANS",
  "Avian",
  "Flight",
  "Raptor",
  "BEASTS",
  "Avatar",
  "Holy",
  "Beast",
  "Wilder",
  "BRUTES",
  "Touki",
  "Brute",
  "Jirae",
  "Jaki",
  "SPIRITS",
  "Haunt",
  "Spirit",
  "Undead",
  "FOULS",
  "Foul",
  "ELEMENTS",
  "Element",
  "HUMANS",
  "Therian",
  "Messian",
  "Gaean",
  "MACHINES",
  "Machine",
  "Amatsu",
  "Demonoid",
  "Femme",
  "Fury",
  "Godly",
  "Herald",
  "Kunitsu",
  "Lady",
  "Shinshou",
  "VEGETATION",
  "Wood"
];

export const ResistanceElements = [
  'sword',
  'gun',
  'fire',
  'ice',
  'elec',
  'force',
  'nerve',
  'almighty',
  'expel',
  'death',
  'curse',
  'bind',
  'rush',
  'punch',
  'flying'
];

export const SkillElements = ResistanceElements.concat(
  'energy',
  'recovery',
  'support',
  'special'
);

export const BaseStats = [
  'HP', 'MP', 'St', 'In', 'Ma', 'Vi', 'Ag', 'Lu'
];

export const ResistCodes = {
  'd': -1100,
  'D': -1050,
  'r': -100,
  'R': -50,
  'n': 0,
  '1': 12,
  '2': 25,
  '3': 37,
  's': 50,
  '5': 100,
  '6': 100,
  '7': 100,
  '-': 100,
  'w': 1150,
  '8': 1200,
  '9': 1250,
  '0': 1300
}

export const RaceOrder = getEnumOrder(Races);
export const ElementOrder = getEnumOrder(SkillElements);

export const FUSION_SETTINGS_KEY = 'shin-megami-tensei-1-tool-settings';
export const FUSION_SETTINGS_VERSION = 1709211400;
export const APP_TITLE = 'Shin Megami Tensei';
