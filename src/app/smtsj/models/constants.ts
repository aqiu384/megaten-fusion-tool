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
  'Haunt',
  'Fiend',
  'Enigma',
  'UMA',
  'Zealot',
  'Geist',
  'Prime',
  'Mitama',
  'Fake'
];

export const PrimeElements = [
  'Erthys',
  'Aeros',
  'Aquans',
  'Flaemis',
  'Gnome',
  'Sylph',
  'Undine',
  'Salamander',
];

export const ResistanceElements = [
  'phy',
  'gun',
  'fir',
  'ice',
  'ele',
  'win',
  'exp',
  'cur'
];

export const SkillElements = ResistanceElements.concat(
  'ail',
  'rec',
  'alm',
  'sup',
  'pas'
);

export const InheritElements = [
  'spe',
  'fir',
  'ice',
  'ele',
  'win',
  'exp',
  'cur',
  'alm',
  'phy',
  'gun',
  'ail',
  'lif',
  'man',
  'sup',
  'rec'
];

export const Ailments = [
  'Poison',
  'Panic',
  'Stone',
  'Strain',
  'Sleep',
  'Charm',
  'Mute',
  'Fear',
  'Bomb'
];

export const BaseStats = [
  'HP', 'MP', 'St', 'Ma', 'Vi', 'Ag', 'Lu'
];

export const ResistanceLevels = [
  'wk', 'no', 'st', 'nu', 'rf', 'dr'
];

export const ResistCodes = {
  w: 1125,
  '-': 100,
  s: 50,
  n: 0,
  r: -100,
  d: -1100
};

export const PasswordEncodings = {
  jap: 'しんいくみＢやるＹけひＫＦとＨむＡちにＺきＷよＬをのたれＮえＳふわＪそりすＣめＰへＱＧＲＤこＭＴまつせかはＥＵてさなあもゆおうろ',
  jen: 'しんいくみBやるＹけひKFとHむAちにZきWよLをのたれNえSふわJそりすCめPへQGRDこMTまつせかはEUてさなあもゆおうろ',
  eng: '$234567890ABCDEFGH%JKLMNOPQRSTUVWXYZabcdefghijk#mnopqrstuvwxyz-+',
  engChars: '$2-90A-H%J-Za-k#m-z+-',
  ren: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz?&',
  renChars: '0-9A-Za-z&?'
};

export const SkillCosts = [0, 112, 155, 222, 347, 564, 952, 1666, 3020, 5663, 10972, 21943, 43886, 87772, 175543];

export const RaceOrder = getEnumOrder(Races);
export const PrimeOrder = getEnumOrder(PrimeElements);
export const SkillElementOrder = getEnumOrder(SkillElements);
export const InheritElementOrder = getEnumOrder(InheritElements.concat('non'));
export const ResistanceOrder = getEnumOrder(ResistanceLevels);

export const VAN_FUSION_SETTINGS_KEY = 'smtsj-fusion-tool-settings';
export const DSJ_FUSION_SETTINGS_KEY = 'smtdsj-fusion-tool-settings';
export const FUSION_SETTINGS_VERSION = 1709211400;
export const APP_TITLE = 'Shin Megami Tensei: Strange Journey';
