function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

export const Races = [];
const BaseRaces = [
  'Fool',
  'Magician',
  'Priestess',
  'Empress',
  'Emperor',
  'Hierophant',
  'Lovers',
  'Chariot',
  'Justice',
  'Hermit',
  'Fortune',
  'Strength',
  'Hanged',
  'Death',
  'Temperance',
  'Devil',
  'Tower',
  'Star',
  'Moon',
  'Sun',
  'Judgement'
];

for (const race of BaseRaces) {
  Races.push(race);
  Races.push(race + ' P');
}

export const ResistanceElements = [
  'phys',
  'gun',
  'fire',
  'ice',
  'elec',
  'wind',
  'psy',
  'nuke',
  'bless',
  'curse'
];

export const SkillElements = ResistanceElements.concat(
  'ailment',
  'healing',
  'almighty',
  'support',
  'passive'
);

export const ElementDemons = [
  'Crystal Skull',
  'Koh-i-Noor',
  'Queen\'s Necklace',
  'Regent',
  'Stone of Scone',
  'Orlov',
  'Emperor\'s Amulet',
  'Hope Diamond'
];

export const BaseStats = [
  'St', 'Ma', 'En', 'Ag', 'Lu'
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

export const RaceOrder = getEnumOrder(Races);
export const ElementOrder = getEnumOrder(SkillElements);
export const ResistanceOrder = getEnumOrder(ResistanceLevels);

export const FUSION_SETTINGS_KEY = 'p5-fusion-tool-settings';
export const FUSION_SETTINGS_VERSION = 1709211400;
export const APP_TITLE = 'Persona 5';
