export const Races = [
  'Omega',  'Megami', 'Deity',   'Vile',   'Snake',
  'Dragon', 'Divine', 'Avian',   'Fallen', 'Avatar',
  'Beast',  'Wilder', 'Genma',   'Fairy',  'Tyrant',
  'Kishin', 'Touki',  'Jaki',    'Femme',  'Ghost',
  'Fiend',  'Hero',   'Element', 'Mitama', 'Foreigner'
];

export const ElementDemons = [
  'Erthys', 'Aeros', 'Aquans', 'Flaemis'
];

export const ResistElements = [
  'phys', 'fire', 'ice', 'elec', 'force', 'curse'
];

export const SkillElements = ResistElements.concat(
  'strike', 'almighty', 'none', 'recovery', 'support', 'passive', 'auto'
);

export const BaseStats = [
  'HP', 'MP', 'St', 'Ma', 'Vi', 'Ag'
];

export const ResistCodes = {
  w: 1125,
  '-': 100,
  s: 50,
  n: 0,
  r: -100,
  d: -1100
};

export const RaceOrder = Races.reduce((acc, race, i) => { acc[race] = i; return acc; }, {});
export const ElementOrder = SkillElements.reduce((acc, elem, i) => { acc[elem] = i; return acc; }, {});
