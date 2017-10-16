import { FissionRow, FissionTable, Compendium, FusionChart, NameTrio } from '../../compendium/models';
import { RaceOrder } from '../../p3/constants';

function findBin(n: number, bins: number[]): number {
  if (!bins.length) {
    return -1;
  }

  let index = 0;

  for (const bin of bins) {
    if (n > bin) {
      index++;
    }
  }

  return index === bins.length ? -1 : index;
}

export function splitWithDiffRace(nameR: string, comp: Compendium, normChart: FusionChart, trioChart: FusionChart): NameTrio[] {
  const recipes: NameTrio[] = [];
  const { race: raceR, lvl: lvlR } = comp.getDemon(nameR);

  const binRs = comp.getResultDemonLvls(raceR);
  const binR = binRs.indexOf(lvlR);

  if (binR === -1) {
    return recipes;
  }

  const fissionT1T2s: FissionRow = {};

  for (const [raceT1, raceT2s] of Object.entries(trioChart.getRaceFissions(raceR))) {
    if (!fissionT1T2s[raceT1]) {
      fissionT1T2s[raceT1] = [];
    }

    for (const raceT2 of raceT2s) {
      if (!fissionT1T2s[raceT2]) {
        fissionT1T2s[raceT2] = [];
      } if (raceT1 !== raceT2) {
        fissionT1T2s[raceT1].push(raceT2);
      }

      fissionT1T2s[raceT2].push(raceT1);
    }
  }

  const fissionT1N1N2s: FissionTable = {};

  for (const [raceT1, raceT2s] of Object.entries(fissionT1T2s)) {
    fissionT1N1N2s[raceT1] = {};

    for (const raceT2 of raceT2s) {
      for (const [raceN1, raceN2s] of Object.entries(normChart.getRaceFissions(raceT2))) {
        fissionT1N1N2s[raceT1][raceN1] = raceN2s.slice();
      }
    }

    for (const raceT2 of raceT2s) {
      if (!fissionT1N1N2s[raceT1][raceT2]) {
        fissionT1N1N2s[raceT1][raceT2] = [];
      }

      fissionT1N1N2s[raceT1][raceT2].push(raceT2);
    }
  }

  const minLvlR = binRs[binR - 1] ? 3 * binRs[binR - 1] - 13 : 0;
  const maxLvlR = 3 * lvlR - 13;

  for (const [raceT1, raceT2s] of Object.entries(fissionT1N1N2s)) {
    for (const lvlT1 of comp.getIngredientDemonLvls(raceT1)) {
      const name1 = comp.reverseLookupDemon(raceT1, lvlT1);

      if (name1 !== nameR) {
        const minLvlT2 = minLvlR - lvlT1;
        const maxLvlT2 = maxLvlR - lvlT1;

        for (const [raceN1, raceN2s] of Object.entries(raceT2s)) {
          for (const lvlN1 of comp.getIngredientDemonLvls(raceN1)) {
            const name2 = comp.reverseLookupDemon(raceN1, lvlN1);

            if (
              name2 !== name1 &&
              name2 !== nameR &&
              (lvlT1 > lvlN1 || (lvlT1 === lvlN1 && RaceOrder[raceT1] < RaceOrder[raceN1]))
            ) {
              const minLvlN2 = minLvlT2 - lvlN1;
              const maxLvlN2 = maxLvlT2 - lvlN1;

              for (const raceN2 of raceN2s) {
                for (const lvlN2 of comp.getIngredientDemonLvls(raceN2)) {
                  const name3 = comp.reverseLookupDemon(raceN2, lvlN2);

                  if (
                    name3 !== name2 &&
                    name3 !== name1 &&
                    name3 !== nameR &&
                    (lvlT1 > lvlN2 || (lvlT1 === lvlN2 && RaceOrder[raceT1] < RaceOrder[raceN2]))
                  ) {
                    if (minLvlN2 < lvlN2 && lvlN2 < maxLvlN2) {
                      recipes.push({ name1, name2, name3 });
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return recipes;
}

export function splitWithSameRace(nameR: string, comp: Compendium, normChart: FusionChart, trioChart: FusionChart): NameTrio[] {
  const recipes: NameTrio[] = [];
  const { race: raceR, lvl: lvlR } = comp.getDemon(nameR);

  const lvlT1s = comp.getIngredientDemonLvls(raceR).filter(lvl => lvl !== lvlR);
  const lvlRs = comp.getResultDemonLvls(raceR);

  for (let i = 0; i < lvlT1s.length; i++) {
    const lvlT1 = lvlT1s[i];
    const binN1s = lvlRs.filter(lvl => lvl !== lvlT1);
    const name1 = comp.reverseLookupDemon(raceR, lvlT1);

    for (let j = i + 1; j < lvlT1s.length; j++) {
      const lvlN1 = lvlT1s[j];
      const binN2s = binN1s.filter(lvl => lvl !== lvlN1);
      const name2 = comp.reverseLookupDemon(raceR, lvlN1);

      for (let k = j + 1; k < lvlT1s.length; k++) {
        const lvlN2 = lvlT1s[k];
        const binRs = binN2s.filter(lvl => lvl !== lvlN2);
        const name3 = comp.reverseLookupDemon(raceR, lvlN2);

        const lvlRp = (lvlT1 + lvlN1 + lvlN2 - 2) / 3 + 5;
        const binR = findBin(lvlRp, binRs);

        if (binR !== -1 && binRs[binR] === lvlR) {
          recipes.push({ name1, name2, name3 });
        }
      }
    }
  }

  return recipes;
}
