import { NamePair, Compendium, FusionChart } from '../models';
import { RaceOrder } from '../../p3/constants';

function findBin(n: number, bins: number[]): number {
  if (!bins.length) {
    return -1;
  }

  let index = 0;

  for (const bin of bins) {
    if (n >= bin) {
      index++;
    }
  }

  return index === bins.length ? -1 : index;
}

export function getFusionT1Rs(
  nameN1: string,
  nameN2: string,
  compendium: Compendium,
  normalChart: FusionChart,
  triangleChart: FusionChart
): NamePair[] {
  const recipes: NamePair[] = [];
  const { race: raceN1, lvl: lvlN1 } = compendium.getDemon(nameN1);
  const { race: raceN2, lvl: lvlN2 } = compendium.getDemon(nameN2);

  const raceT2 = normalChart.getRaceFusions(raceN1)[raceN2];

  if (!raceT2) {
    return recipes;
  }

  const fusionT1Rs = triangleChart.getRaceFusions(raceT2);

  for (const [raceT1, raceR] of Object.entries(fusionT1Rs)) {
    const lvlRs = compendium.getResultDemonLvls(raceR);
    const binRs = lvlRs.map(lvl => 3 * lvl - 13 - lvlN1 - lvlN2);

    for (const lvlT1 of compendium.getIngredientDemonLvls(raceT1)) {
      if ((lvlT1 > lvlN1 || (lvlT1 === lvlN1 && RaceOrder[raceT1] < RaceOrder[raceN1])) &&
        (lvlT1 > lvlN2 || (lvlT1 === lvlN2 && RaceOrder[raceT1] < RaceOrder[raceN2]))) {
        const binR = findBin(lvlT1, binRs);

        if (binR !== -1) {
          recipes.push({
            name1: compendium.reverseLookupDemon(raceT1, lvlT1),
            name2: compendium.reverseLookupDemon(raceR, lvlRs[binR])
          });
        }
      }
    }
  }

  return recipes;
}

export function getFusionN2Rs(
  nameT1: string,
  nameN1: string,
  compendium: Compendium,
  normalChart: FusionChart,
  triangleChart: FusionChart
): NamePair[] {
  const recipes: NamePair[] = [];
  const { race: raceT1, lvl: lvlT1 } = compendium.getDemon(nameT1);
  const { race: raceN1, lvl: lvlN1 } = compendium.getDemon(nameN1);

  if (!(lvlT1 > lvlN1 || (lvlT1 === lvlN1 && RaceOrder[raceT1] < RaceOrder[raceN1]))) {
    return recipes;
  }

  const fusionN2T2s = normalChart.getRaceFusions(raceN1);
  const fusionT2Rs = triangleChart.getRaceFusions(raceT1);
  const fusionN2Rs: { [race: string]: string } = {};

  fusionN2T2s[raceN1] = raceN1;

  for (const [raceN2, raceT2] of Object.entries(fusionN2T2s)) {
    fusionN2Rs[raceN2] = fusionT2Rs[raceT2];
  }

  for (const [raceN2, raceR] of Object.entries(fusionN2Rs)) {
    const lvlRs = compendium.getResultDemonLvls(raceR);
    const binRs = lvlRs.map(lvl => 3 * lvl - 13 - lvlT1 - lvlN1);

    for (const lvlN2 of compendium.getIngredientDemonLvls(raceN2)) {
      if (lvlT1 > lvlN2 || (lvlT1 === lvlN2 && RaceOrder[raceT1] < RaceOrder[raceN2])) {
        const binR = findBin(lvlN2, binRs);

        if (binR !== -1) {
          recipes.push({
            name1: compendium.reverseLookupDemon(raceN2, lvlN2),
            name2: compendium.reverseLookupDemon(raceR, lvlRs[binR])
          });
        }
      }
    }
  }

  return recipes;
}
