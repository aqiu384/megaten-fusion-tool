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
  'Tree',
  'Divine',
  'Flight',
  'Yoma',
  'Nymph',
  'Vile',
  'Raptor',
  'Wood',
  'Deity',
  'Avatar',
  'Holy',
  'Genma',
  'Fairy',
  'Beast',
  'Jirae',
  'Snake',
  'Reaper',
  'Wilder',
  'Jaki',
  'Vermin',
  'Fury',
  'Lady',
  'Dragon',
  'Kishin',
  'Fallen',
  'Brute',
  'Femme',
  'Night',
  'Tyrant',
  'Drake',
  'Spirit',
  'Foul',
  'Ghost',
  'Fiend',
  'Enigma',
  'Food',
  'Zealot',
  'Entity',
  'Famed',
  'Amatsu',
  'Kunitsu',
  'Undead',
  'Element',
  'Godly',
  'Chaos',
  'Primal'
];

export const ResistanceElements = [
  'phys',
  'gun',
  'fire',
  'ice',
  'elec',
  'force',
  'light',
  'dark'
];

export const AffinityElements = ResistanceElements.concat(
  'almighty',
  'recovery',
  'ailment',
  'support'
);

export const SkillElements = AffinityElements.concat(
  'other',
  'passive'
);

export const ShortElements = { };
export const InverseShortElements = { };
for (const element of SkillElements) {
  ShortElements[element] = element.slice(0, 3);
  InverseShortElements[element.slice(0, 3)] = element;
}

InverseShortElements['spe'] = 'other';

export const BaseStats = [
  'HP', 'MP', 'St', 'Dx', 'Ma', 'Ag', 'Lu'
];

export const ResistanceLevels = [
  'wk', 'no', 'rs', 'nu', 'rp', 'ab'
];

export const ResistCodes = {
  w: 1125,
  '-': 100,
  s: 50,
  n: 0,
  r: -100,
  d: -1100
};

export const ElementDemons = [
  'Salamander',
  'Undine',
  'Sylph',
  'Gnome',
  'Flaemis',
  'Aquans',
  'Aeros',
  'Erthys'
];

export const Ailments = [
  'Bind',
  'Panic',
  'Poison',
  'Sick',
  'Sleep'
];

export const RaceOrder = getEnumOrder(Races);
export const ElementOrder = getEnumOrder(SkillElements);
export const ResistanceOrder = getEnumOrder(ResistanceLevels);

export const FUSION_SETTINGS_KEY = 'smt4-fusion-tool-settings';
export const FUSION_SETTINGS_VERSION = 1709211400;
export const APP_TITLE = 'Shin Megami Tensei IV';
