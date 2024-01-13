function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

export const Arcanas = [
  'Magician',
  'Priestess',
  'Empress',
  'Emperor',
  'Hierophant',
  'Lovers',
  'Chariot',
  'Strength',
  'Hermit',
  'Fortune',
  'Justice',
  'Hanged',
  'Death',
  'Temperance',
  'Devil',
  'Tower',
  'Star',
  'Moon',
  'Sun',
  'Judgement',
  'World',
  'Fool',
];

export const DemonOrders = [
  'Night',
  'Yoma',
  'Fairy',
  'Divine',
  'Fallen',
  'Snake',
  'Drake',
  'Flight',
  'Raptor',
  'Beast',
  'Wilder',
  'Femme',
  'Brute',
  'Jirae',
  'Jaki',
  'Haunt',
  'Spirit',
  'Grave',
  'Foul',
  'Karma',
  'Fiend',
  'Meta'
];

export const Races = Arcanas.concat(DemonOrders).concat(['Gem']);

export const ResistanceElements = [
  'phys',
  'fist',
  'gun',
  'rifle',
  'tech',
  'rush',
  'fire',
  'ice',
  'wind',
  'earth',
  'force',
  'light',
  'dark',
  'nerve'
];

export const PhysResistanceElements = [
  'sword1h',
  'sword2h',
  'spear',
  'axe',
  'whip',
  'thrown',
  'arrow',
  'fist',
  'handgun',
  'autogun',
  'shotgun',
  'rifle',
  'tech',
  'rush',
]

export const MagicResistanceElements = [
  'fire',
  'ice',
  'wind',
  'earth',
  'elec',
  'nuke',
  'blast',
  'gravity',
  'expel',
  'miracle',
  'death',
  'curse',
  'nerve',
  'almighty'
]

export const SkillElements = PhysResistanceElements.concat(
  'fire',
  'ice',
  'wind',
  'earth',
  'elec',
  'nuke',
  'blast',
  'gravity',
  'expel',
  'miracle',
  'bless',
  'prayer',
  'death',
  'curse',
  'nerve',
  'occult',
  'almighty',
  'spec'
);

export const InheritElements = [
  'fire',
  'ice',
  'wind',
  'earth',
  'expel',
  'miracle',
  'bless',
  'death',
  'curse',
  'nerve'
];

export const BaseAtks = [
  'SP cost', 'MAtk', 'MDef'
]

export const BaseStats = [
  'St', 'Vi', 'Dx', 'Ag', 'Lu'
];

export const ResistCodes = {
  X: 6300,
  x: 6200,
  W: 6175,
  w: 6150,
  V: 6125,
  '-': 5100,
  T: 4075,
  s: 4050,
  S: 4025,
  n: 3000,
  R: 2050,
  r: 2100,
  Q: 2200,
  D: 1050,
  d: 1100
};

export const PartyMembers = [
  'Protag',
  'Maki',
  'Mark',
  'Nanjo',
  'Brown',
  'Eriko',
  'Ayase',
  'Yukino',
  'Reiji'
];

export const RaceOrder = getEnumOrder(Races);
export const SkillElementOrder = getEnumOrder(SkillElements);

export const FUSION_SETTINGS_KEY = 'p1-fusion-tool-settings';
export const FUSION_SETTINGS_VERSION = 1709211400;
export const APP_TITLE = 'Megami Ibunroku Persona';
