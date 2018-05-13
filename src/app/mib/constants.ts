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
  X: 1300,
  x: 1200,
  W: 1175,
  w: 1150,
  V: 1125,
  '-': 100,
  T: 75,
  s: 50,
  S: 25,
  n: 0,
  R: -50,
  r: -100,
  Q: -200,
  D: -1050,
  d: -1100
};

export const PartyMembers = [
  'Protag',
  'Maki',
  'Brown',
  'Nanjo',
  'Mark',
  'Eriko',
  'Ayase',
  'Yukino',
  'Reiji'
];

export const Gems = [
  'Alexandrite',
  'Diamond',
  'Sapphire',
  'Emerald',
  'Ruby',
  'Pearl',
  'Tanzanite',
  'Opal',
  'Amethyst',
  'Garnet',
  'Aquamarine',
  'Topaz',
  'Moonstone',
  'Malachite',
  'Onyx',
  'Turquoise'
];

export const RaceOrder = getEnumOrder(Races);
export const SkillElementOrder = getEnumOrder(SkillElements);

export const FUSION_SETTINGS_KEY = 'mib-fusion-tool-settings';
export const FUSION_SETTINGS_VERSION = 1709211400;
export const APP_TITLE = 'Megami Ibunroku Persona';
