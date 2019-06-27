import { NamePair, FusionEntry, FusionPair, Compendium } from '../../compendium/models';

const RARITY_DELTA_COSTS = [
  [5,       5,       5,       5,       5,       5],
  [5,       5,       25,      50,      0,       0],
  [250,     500,     2500,    5000,    5200,    5400],
  [0,       6000,    150000,  300000,  320000,  0],
  [0,       60000,   1500000, 3000000, 4200000, 0]
];

const GRADE_DELTA_COSTS = [
  0, 0, 0.3, 0.45, 60, 75, 1080, 1260, 14400, 16200
];

const BASE_ARCH_COEFFS = [
  1, 1, 1, 0.5, 0.7
];

const SPECIAL_FUSION_COSTS = {
  'Chupacabra': Math.floor(100 / 3),
  'Kamiotoko': Math.floor(500 / 3),
  'Kanbari': 1000 / 4,
  'Hare of Inaba': Math.floor(5000 / 3),
  'Kinmamon': 10000 / 4,
  'Attis': 200000 / 4,
  'Kama': 200000 / 4,
  'Alilat': 500000 / 4,
  'Parvati': 840000 / 3
}

function estimateMagCost(grade1, grade2, gradeR): number {
  const rare1 = Math.floor(grade1 / 20) + 1;
  const rare2 = Math.floor(grade2 / 20) + 1;
  const rareR = Math.floor(gradeR / 20) + 1;

  const rareDelta = Math.max(1, 2 * rareR - rare1 - rare2);
  const gradeDelta = Math.max(0, 2 * gradeR - grade1 - grade2);
  const rareCost = RARITY_DELTA_COSTS[rareR - 1][rareDelta + 1] || 0;
  const gradeCost = GRADE_DELTA_COSTS[Math.floor(gradeR / 10)];

  return rareCost + Math.floor(gradeCost * gradeDelta / 2);
}

export function toFusionEntry(currentDemon: string, name: string, compendium: Compendium): FusionEntry {
  const demon = compendium.getDemon(name);
  const price = SPECIAL_FUSION_COSTS[currentDemon] || demon.price;

  return {
    price,
    race1: demon.race,
    lvl1: demon.lvl,
    name1: name
  };
}

export function toFusionPair(currentDemon: string, names: NamePair, compendium: Compendium): FusionPair {
  const demon1 = compendium.getDemon(names.name1);
  const demon2 = compendium.getDemon(names.name2);
  const demonR = compendium.getDemon(currentDemon);

  return {
    price: estimateMagCost(demon1.lvl, demon2.lvl, demonR.lvl),
    race1: demon1.race,
    lvl1: demon1.lvl,
    name1: names.name1,
    race2: demon2.race,
    lvl2: demon2.lvl,
    name2: names.name2
  };
}

export function toFusionPairResult(currentDemon: string, names: NamePair, compendium: Compendium): FusionPair {
  const demon1 = compendium.getDemon(currentDemon);
  const demon2 = compendium.getDemon(names.name1);
  const demonR = compendium.getDemon(names.name2);

  return {
    price: estimateMagCost(demon1.lvl, demon2.lvl, demonR.lvl),
    race1: demon2.race,
    lvl1: demon2.lvl,
    name1: names.name1,
    race2: demonR.race,
    lvl2: demonR.lvl,
    name2: names.name2
  };
}
