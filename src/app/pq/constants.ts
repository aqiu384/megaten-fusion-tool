import { NormalFusionCalculator } from '../compendium/models/normal-fusion-calculator';

import { fuseWithDiffRace } from '../compendium/fusions/smt-nonelem-fusions';
import { fuseWithSameRace } from '../compendium/fusions/per-nonelem-fusions';

import { splitWithDiffRace } from '../compendium/fusions/smt-nonelem-fissions';
import { splitWithSameRace } from '../compendium/fusions/per-nonelem-fissions';

export const Races = [
  'Fool',       'Magician', 'Priestess', 'Empress', 'Emperor',
  'Hierophant', 'Lovers',   'Chariot',   'Justice', 'Hermit',
  'Fortune',    'Strength', 'Hanged',    'Death',   'Temperance',
  'Devil',      'Tower',    'Star',      'Moon',    'Sun',
  'Judgement',  'FOE'
];

export const ElementDemons = [];

export const ResistElements = ['cut', 'bash', 'stab', 'fire', 'ice', 'elec', 'wind', 'light', 'dark'];

export const Ailments = ['Sleep', 'Panic', 'Poison', 'Curse', 'Para', 'SBind', 'MBind', 'ABind', 'Down', 'KO'];

export const SkillElements = ResistElements.concat(
  'almighty', 'ailment', 'recovery',
  'support',  'navi',    'passive'
);

export const InheritElements = [
  'bash', 'fire', 'ice', 'elec', 'wind',
  'light', 'dark', 'almighty', 'recovery', 'passive'
];

export const BaseStats = ['HP', 'MP'];

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

export const P3_NORMAL_FUSION_CALCULATOR = new NormalFusionCalculator(
  [ fuseWithDiffRace, fuseWithSameRace ],
  [ ]
);

export const P3_NORMAL_FISSION_CALCULATOR = new NormalFusionCalculator(
  [ splitWithDiffRace, splitWithSameRace ],
  [ ]
);

export const FUSION_SETTINGS_KEY = 'pq-fusion-tool-settings';
export const FUSION_SETTINGS_VERSION = 1709211400;
export const APP_TITLE = 'Persona Q: Shadow of the Labyrinth';
