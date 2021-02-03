import { FusionTable, Compendium, NameTrio, SquareChart } from '../models';
import { fuseWithElement } from './smt-nonelem-fusions';

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

export function fuseT1WithDiffRace(nameT1: string, comp: Compendium, chart: SquareChart): NameTrio[] {
  const { normalChart: normChart, tripleChart: trioChart, raceOrder } = chart;
  const { race: raceT1, lvl: lvlT1, currLvl: clvlT1 } = comp.getDemon(nameT1);
  const lvlMod = 3 * trioChart.lvlModifier;
  const recipes: NameTrio[] = [];

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
      const clvlN1 = comp.getDemon(name1).currLvl;

      if (
        name1 !== nameT1 &&
        (clvlT1 > clvlN1 || (clvlT1 === clvlN1 && raceOrder[raceT1] < raceOrder[raceN1]))
      ) {
        for (const [raceN2, raceR] of Object.entries(raceN2s)) {
          const lvlRs = comp.getResultDemonLvls(raceR);
          const binN2s = lvlRs.map(lvl => 3 * lvl - lvlMod - lvlT1 - lvlN1);

          for (const lvlN2 of comp.getIngredientDemonLvls(raceN2)) {
            const name2 = comp.reverseLookupDemon(raceN2, lvlN2);
            const clvlN2 = comp.getDemon(name2).currLvl;

            if (
              name2 !== name1 &&
              name2 !== nameT1 &&
              (raceN1 !== raceN2 || lvlN1 < lvlN2) &&
              (clvlT1 > clvlN2 || (clvlT1 === clvlN2 && raceOrder[raceT1] < raceOrder[raceN2]))
            ) {
              if (comp.isElementDemon(raceR)) {
                recipes.push({ name1, name2, name3: raceR });
              } else {
                const binN2 = findBin(lvlN2, binN2s);

                if (binN2 !== -1) {
                  const name3 = comp.reverseLookupDemon(raceR, lvlRs[binN2]);

                  if (name3 !== name2 && name3 !== name1 && name3 !== nameT1) {
                    recipes.push({ name1, name2, name3 });
                  } else if (binN2 + 1 < lvlRs.length) {
                    recipes.push({ name1, name2, name3: comp.reverseLookupDemon(raceR, lvlRs[binN2 + 1]) });
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

export function fuseN1WithDiffRace(nameN1: string, comp: Compendium, chart: SquareChart): NameTrio[] {
  const { normalChart: normChart, tripleChart: trioChart, raceOrder } = chart;
  const { race: raceN1, lvl: lvlN1, currLvl: clvlN1 } = comp.getDemon(nameN1);
  const lvlMod = 3 * trioChart.lvlModifier;
  const recipes: NameTrio[] = [];

  const fusionN2T1Rs: FusionTable = {};

  fusionN2T1Rs[raceN1] = Object.assign({}, trioChart.getRaceFusions(raceN1));
  delete fusionN2T1Rs[raceN1][raceN1];

  for (const [raceN2, raceT2] of Object.entries(normChart.getRaceFusions(raceN1))) {
    fusionN2T1Rs[raceN2] = trioChart.getRaceFusions(raceT2);
  }

  for (const [raceN2, raceT1s] of Object.entries(fusionN2T1Rs)) {
    for (const lvlN2 of comp.getIngredientDemonLvls(raceN2)) {
      const name1 = comp.reverseLookupDemon(raceN2, lvlN2);
      const clvlN2 = comp.getDemon(name1).currLvl;

      if (name1 !== nameN1) {
        for (const [raceT1, raceR] of Object.entries(raceT1s)) {
          const lvlRs = comp.getResultDemonLvls(raceR);
          const binT1s = lvlRs.map(lvl => 3 * lvl - lvlMod - lvlN1 - lvlN2);

          for (const lvlT1 of comp.getIngredientDemonLvls(raceT1)) {
            const name2 = comp.reverseLookupDemon(raceT1, lvlT1);
            const clvlT1 = comp.getDemon(name2).currLvl;

            if (
              name2 !== name1 &&
              name2 !== nameN1 &&
              (clvlT1 > clvlN1 || (clvlT1 === clvlN1 && raceOrder[raceT1] < raceOrder[raceN1])) &&
              (clvlT1 > clvlN2 || (clvlT1 === clvlN2 && raceOrder[raceT1] < raceOrder[raceN2]))
            ) {
              if (comp.isElementDemon(raceR)) {
                recipes.push({ name1, name2, name3: raceR });
              } else {
                const binT1 = findBin(lvlT1, binT1s);

                if (binT1 !== -1) {
                  const name3 = comp.reverseLookupDemon(raceR, lvlRs[binT1]);

                  if (name3 !== name2 && name3 !== name1 && name3 !== nameN1) {
                      recipes.push({ name1, name2, name3 });
                  } else if (binT1 + 1 < lvlRs.length) {
                    recipes.push({ name1, name2, name3: comp.reverseLookupDemon(raceR, lvlRs[binT1 + 1]) });
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

export function fuseWithSameRace(nameN1: string, comp: Compendium, chart: SquareChart): NameTrio[] {
  const { normalChart: normChart, tripleChart: trioChart } = chart;
  const { race: raceN1, lvl: lvlN1 } = comp.getDemon(nameN1);
  const raceR = trioChart.getRaceFusions(raceN1)[raceN1];
  const recipes: NameTrio[] = [];

  if (!raceR) {
    return recipes;
  }

  const lvlT1s = comp.getIngredientDemonLvls(raceN1).filter(lvl => lvl !== lvlN1);
  const binT1s = comp.getResultDemonLvls(raceN1).filter(lvl => lvl !== lvlN1);
  const lvlMod = trioChart.lvlModifier;

  for (let i = 0; i < lvlT1s.length; i++) {
    const lvlT1 = lvlT1s[i];
    const binN2s = binT1s.filter(lvl => lvl !== lvlT1);
    const name1 = comp.reverseLookupDemon(raceN1, lvlT1);

    for (let j = i + 1; j < lvlT1s.length; j++) {
      const lvlN2 = lvlT1s[j];
      const binRs = binN2s.filter(lvl => lvl !== lvlN2);
      const name2 = comp.reverseLookupDemon(raceN1, lvlN2);

      if (comp.isElementDemon(raceR)) {
        recipes.push({ name1, name2, name3: raceR });
      } else {
        const lvlRp = (lvlT1 + lvlN1 + lvlN2) / 3 + lvlMod;
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
  }

  return recipes;
}

export function fuseWithElementPair(name: string, comp: Compendium, chart: SquareChart): NameTrio[] {
  return fuseWithElement(name, comp, chart.tripleChart).map(pair => {
    const [name1, name2] = pair.name1.split(' x ');
    return { name1, name2, name3: pair.name2 };
  });
}
