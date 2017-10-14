import { NamePair, Compendium, FusionChart } from '../models';
import { RaceOrder } from '../../p3/constants';

export function getFissionT1N1s(
  nameN2: string,
  nameR: string,
  compendium: Compendium,
  normalChart: FusionChart,
  triangleChart: FusionChart
): NamePair[] {
  const recipes: NamePair[] = [];
  const { race: raceN2, lvl: lvlN2 } = compendium.getDemon(nameN2);
  const { race: raceR, lvl: lvlR } = compendium.getDemon(nameR);

  const binRs = compendium.getResultDemonLvls(raceR);
  const binR = binRs.indexOf(lvlR);

  if (binR === -1) {
    return recipes;
  }

  const minLvlR = binRs[binR - 1] ? 3 * binRs[binR - 1] - 13 - lvlN2 : 0;
  const maxLvlR = 3 * lvlR - 13 - lvlN2;
  const fissionT1N1s: { raceA: string, raceB: string }[] = [];

  for (const [raceN1, raceT2] of Object.entries(normalChart.getRaceFusions(raceN2))) {
    for (const [raceTx, raceTys] of Object.entries(triangleChart.getRaceFissions(raceR))) {
      for (const raceTy of raceTys) {
        if (raceT2 === raceTx) {
          fissionT1N1s.push({ raceA: raceTy, raceB: raceN1 });
        } else if (raceT2 === raceTy) {
          fissionT1N1s.push({ raceA: raceTx, raceB: raceN1 });
        }
      }
    }
  }

  for (const { raceA: raceT1, raceB: raceN1 } of fissionT1N1s) {
    for (const lvlT1 of compendium.getIngredientDemonLvls(raceT1)) {
      if (lvlT1 > lvlN2 || (lvlT1 === lvlN2 && RaceOrder[raceT1] < RaceOrder[raceN2])) {
        for (const lvlN1 of compendium.getIngredientDemonLvls(raceN1)) {
          if ((lvlT1 > lvlN1 || (lvlT1 === lvlN1 && RaceOrder[raceT1] < RaceOrder[raceN1])) &&
            minLvlR < lvlT1 + lvlN1 && lvlT1 + lvlN1 <= maxLvlR) {
            recipes.push({
              name1: compendium.reverseLookupDemon(raceT1, lvlT1),
              name2: compendium.reverseLookupDemon(raceN1, lvlN1)
            });
          }
        }
      }
    }
  }

  return recipes;
}

export function getFissionN1N2s(
  nameT1: string,
  nameR: string,
  compendium: Compendium,
  normalChart: FusionChart,
  triangleChart: FusionChart
): NamePair[] {
  const recipes: NamePair[] = [];
  const { race: raceT1, lvl: lvlT1 } = compendium.getDemon(nameT1);
  const { race: raceR, lvl: lvlR } = compendium.getDemon(nameR);

  const binRs = compendium.getResultDemonLvls(raceR);
  const binR = binRs.indexOf(lvlR);

  if (binR === -1) {
    return recipes;
  }

  const minLvlR = binRs[binR - 1] ? 3 * binRs[binR - 1] - 13 - lvlT1 : 0;
  const maxLvlR = 3 * lvlR - 13 - lvlT1;
  const fissionN1N2s: { raceA: string, raceB: string }[] = [];

  for (const [raceT2, raceRx] of Object.entries(triangleChart.getRaceFusions(raceT1))) {
    if (raceRx === raceR) {
      for (const [raceA, raceBs] of Object.entries(normalChart.getRaceFissions(raceT2))) {
        for (const raceB of raceBs) {
          fissionN1N2s.push({ raceA, raceB });
        }
      }
    }
  }

  for (const { raceA: raceN1, raceB: raceN2 } of fissionN1N2s) {
    for (const lvlN1 of compendium.getIngredientDemonLvls(raceN1)) {
      if (lvlT1 > lvlN1 || (lvlT1 === lvlN1 && RaceOrder[raceT1] < RaceOrder[raceN1])) {
        for (const lvlN2 of compendium.getIngredientDemonLvls(raceN2)) {
          if ((lvlT1 > lvlN2 || (lvlT1 === lvlN2 && RaceOrder[raceT1] < RaceOrder[raceN2])) &&
            minLvlR < lvlN1 + lvlN2 && lvlN1 + lvlN2 <= maxLvlR) {
            recipes.push({
              name1: compendium.reverseLookupDemon(raceN1, lvlN1),
              name2: compendium.reverseLookupDemon(raceN2, lvlN2)
            });
          }
        }
      }
    }
  }

  return recipes;
}
