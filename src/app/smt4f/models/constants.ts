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

export const Ailments = [
  'sleep',
  'panic',
  'charm',
  'mute',
  'poison',
  'sick',
  'bind',
  'daze'
];

export const BaseStats = [
  'hp', 'mp', 'st', 'dx', 'ma', 'ag', 'lu'
];

export const ResistanceLevels = [
  'wk', 'no', 'rs', 'nu', 'rp', 'ab'
];

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

export const RaceOrder = getEnumOrder(Races);
export const ElementOrder = getEnumOrder(SkillElements);
export const ResistanceOrder = getEnumOrder(ResistanceLevels);

export const FUSION_SETTINGS_KEY = 'smt4f-fusion-tool-settings';
export const FUSION_SETTINGS_VERSION = 1709211400;
export const APP_TITLE = 'Shin Megami Tensei IV: Apocalypse';
