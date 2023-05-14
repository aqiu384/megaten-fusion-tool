import { NamePair, FusionPair, Compendium } from '../../compendium/models';
import { Races } from '../constants';
import FUSION_CHART_JSON from '../data/fusion-chart.json';

const COLOR_ABBRS = {
  'B': 0,
  'W': 100000,
  'R': 200000
};

const INHERIT_ABBRS = {
  '2': 20000,
  '1': 40000,
  '0': 60000,
  'T': 80000
};

const PRICE_CLASSES = {
  0: null,
  20000: 'fusion-color blue second',
  40000: 'fusion-color blue first',
  60000: 'fusion-color blue none',
  80000: 'fusion-color blue unfav',
  120000: 'fusion-color white second',
  140000: 'fusion-color white first',
  160000: 'fusion-color white none',
  180000: 'fusion-color white unfav',
  220000: 'fusion-color red second',
  240000: 'fusion-color red first',
  260000: 'fusion-color red none',
  280000: 'fusion-color red unfav'
}

const FusionRaces = FUSION_CHART_JSON['races'];
const FusionRankTable = Races.reduce((acc, r) => { acc[r] = {}; return acc; }, {});

for (let r = 0; r < FusionRaces.length; r++) {
  const race1 = FusionRaces[r];
  const colorRow = Array.from(<string>FUSION_CHART_JSON['colors'][r]);
  const inheritRow = Array.from(<string>FUSION_CHART_JSON['inherits'][r]);

  for (let c = r + 1; c < FusionRaces.length; c++) {
    const race2 = FusionRaces[c];
    const rankR = COLOR_ABBRS[colorRow[c]] + INHERIT_ABBRS[inheritRow[c]];

    FusionRankTable[race1][race2] = rankR;
    FusionRankTable[race2][race1] = rankR;
  }
}

export function toFusionPair(names: NamePair, compendium: Compendium): FusionPair {
  const demon1 = compendium.getDemon(names.name1);
  const demon2 = compendium.getDemon(names.name2);
  const basePrice = FusionRankTable[demon1.race][demon2.race] || 0;

  return {
    price: basePrice + demon1.price + demon2.price,
    race1: demon1.race,
    lvl1: demon1.lvl,
    name1: names.name1,
    race2: demon2.race,
    lvl2: demon2.lvl,
    name2: names.name2,
    notes: PRICE_CLASSES[basePrice]
  };
}

export function toFusionPairResult(currentDemon: string, names: NamePair, compendium: Compendium): FusionPair {
  const demon1 = compendium.getDemon(currentDemon);
  const demon2 = compendium.getDemon(names.name1);
  const demonR = compendium.getDemon(names.name2);
  const basePrice = FusionRankTable[demon1.race][demon2.race] || 0;

  return {
    price: basePrice + demon1.price + demon2.price,
    race1: demon2.race,
    lvl1: demon2.lvl,
    name1: names.name1,
    race2: demonR.race,
    lvl2: demonR.lvl,
    name2: names.name2,
    notes: PRICE_CLASSES[basePrice]
  };
}
