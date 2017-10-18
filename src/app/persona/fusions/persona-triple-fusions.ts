import { FusionTable, Compendium, FusionChart, NameTrio } from '../../compendium/models';
import { RaceOrder } from '../../p4/constants';

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

export function fuseT1WithDiffRace(nameT1: string, comp: Compendium, normChart: FusionChart, trioChart: FusionChart): NameTrio[] {
  const recipes: NameTrio[] = [];
  const { race: raceT1, lvl: lvlT1 } = comp.getDemon(nameT1);

  const fusionT2Rs = trioChart.getRaceFusions(raceT1);
  const fusionN1N2Rs: FusionTable = {};

  for (const [raceT2, raceR] of Object.entries(fusionT2Rs)) {
    if (!fusionN1N2Rs[raceT2]) {
      fusionN1N2Rs[raceT2] = {};
    }

    if (raceT1 !== raceT2) {
      fusionN1N2Rs[raceT2][raceT2] = raceR;
    }

    for (const [raceN1, raceN2s] of Object.entries(normChart.getRaceFissions(raceT2))) {
      if (!fusionN1N2Rs[raceN1]) {
        fusionN1N2Rs[raceN1] = {};
      }

      for (const raceN2 of raceN2s) {
        fusionN1N2Rs[raceN1][raceN2] = raceR;
      }
    }
  }

  for (const [raceN1, raceN2s] of Object.entries(fusionN1N2Rs)) {
    for (const lvlN1 of comp.getIngredientDemonLvls(raceN1)) {
      const name1 = comp.reverseLookupDemon(raceN1, lvlN1);

      if (
        name1 !== nameT1 &&
        (lvlT1 > lvlN1 || (lvlT1 === lvlN1 && RaceOrder[raceT1] < RaceOrder[raceN1]))
      ) {
        for (const [raceN2, raceR] of Object.entries(raceN2s)) {
          const lvlRs = comp.getResultDemonLvls(raceR);
          const binN2s = lvlRs.map(lvl => 3 * lvl - 13 - lvlT1 - lvlN1);

          for (const lvlN2 of comp.getIngredientDemonLvls(raceN2)) {
            const name2 = comp.reverseLookupDemon(raceN2, lvlN2);

            if (
              name2 !== name1 &&
              name2 !== nameT1 &&
              (raceN1 !== raceN2 || lvlN1 < lvlN2) &&
              (lvlT1 > lvlN2 || (lvlT1 === lvlN2 && RaceOrder[raceT1] < RaceOrder[raceN2]))
            ) {
              const binN2 = findBin(lvlN2, binN2s);

              if (binN2 !== -1) {
                const name3 = comp.reverseLookupDemon(raceR, lvlRs[binN2]);

                if (name3 !== name2 && name3 !== name1 && name3 !== nameT1) {
                  recipes.push({ name1, name2, name3 });
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

export function fuseN1WithDiffRace(nameN1: string, comp: Compendium, normChart: FusionChart, trioChart: FusionChart): NameTrio[] {
  const recipes: NameTrio[] = [];
  const { race: raceN1, lvl: lvlN1 } = comp.getDemon(nameN1);

  const fusionN2T1Rs: FusionTable = {};

  fusionN2T1Rs[raceN1] = trioChart.getRaceFusions(raceN1);
  delete fusionN2T1Rs[raceN1][raceN1];

  for (const [raceN2, raceT2] of Object.entries(normChart.getRaceFusions(raceN1))) {
    fusionN2T1Rs[raceN2] = trioChart.getRaceFusions(raceT2);
  }

  for (const [raceN2, raceT1s] of Object.entries(fusionN2T1Rs)) {
    for (const lvlN2 of comp.getIngredientDemonLvls(raceN2)) {
      const name1 = comp.reverseLookupDemon(raceN2, lvlN2);

      if (name1 !== nameN1) {
        for (const [raceT1, raceR] of Object.entries(raceT1s)) {
          const lvlRs = comp.getResultDemonLvls(raceR);
          const binT1s = lvlRs.map(lvl => 3 * lvl - 13 - lvlN1 - lvlN2);

          for (const lvlT1 of comp.getIngredientDemonLvls(raceT1)) {
            const name2 = comp.reverseLookupDemon(raceT1, lvlT1);

            if (
              name2 !== name1 &&
              name2 !== nameN1 &&
              (lvlT1 > lvlN1 || (lvlT1 === lvlN1 && RaceOrder[raceT1] < RaceOrder[raceN1])) &&
              (lvlT1 > lvlN2 || (lvlT1 === lvlN2 && RaceOrder[raceT1] < RaceOrder[raceN2]))
            ) {
              const binT1 = findBin(lvlT1, binT1s);

              if (binT1 !== -1) {
                const name3 = comp.reverseLookupDemon(raceR, lvlRs[binT1]);

                if (name3 !== name2 && name3 !== name1 && name3 !== nameN1) {
                  recipes.push({ name1, name2, name3 });
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

export function fuseWithSameRace(nameN1: string, comp: Compendium, normChart: FusionChart, trioChart: FusionChart): NameTrio[] {
  const recipes: NameTrio[] = [];
  const { race: raceN1, lvl: lvlN1 } = comp.getDemon(nameN1);

  const lvlT1s = comp.getIngredientDemonLvls(raceN1).filter(lvl => lvl !== lvlN1);
  const binT1s = comp.getResultDemonLvls(raceN1).filter(lvl => lvl !== lvlN1);

  for (let i = 0; i < lvlT1s.length; i++) {
    const lvlT1 = lvlT1s[i];
    const binN2s = binT1s.filter(lvl => lvl !== lvlT1);
    const name1 = comp.reverseLookupDemon(raceN1, lvlT1);

    for (let j = i + 1; j < lvlT1s.length; j++) {
      const lvlN2 = lvlT1s[j];
      const binRs = binN2s.filter(lvl => lvl !== lvlN2);
      const name2 = comp.reverseLookupDemon(raceN1, lvlN2);

      const lvlRp = (lvlT1 + lvlN1 + lvlN2 - 2) / 3 + 5;
      const binR = findBin(lvlRp, binRs);

      if (binR !== -1) {
        recipes.push({
          name1,
          name2,
          name3: comp.reverseLookupDemon(raceN1, binRs[binR])
        });
      }
    }
  }

  return recipes;
}
