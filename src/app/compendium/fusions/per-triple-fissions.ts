import { FissionRow, FissionTable, Compendium, SquareChart, NameTrio } from '../models';
import { fuseT1WithDiffRace, fuseN1WithDiffRace } from './per-triple-fusions';
import { splitWithElement } from './smt-nonelem-fissions';

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

export function splitWithDiffRace(nameR: string, comp: Compendium, chart: SquareChart): NameTrio[] {
  const { normalChart: normChart, tripleChart: trioChart, raceOrder } = chart;
  const { race: raceR, lvl: lvlR } = comp.getDemon(nameR);
  const lvlMod = 3 * trioChart.lvlModifier;
  const recipes: NameTrio[] = [];

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
        if (!fissionT1N1N2s[raceT1][raceN1]) {
          fissionT1N1N2s[raceT1][raceN1] = [];
        }

        fissionT1N1N2s[raceT1][raceN1] = fissionT1N1N2s[raceT1][raceN1].concat(raceN2s);
      }
    }

    for (const raceT2 of raceT2s) {
      if (raceT1 !== raceT2) {
        if (!fissionT1N1N2s[raceT1][raceT2]) {
          fissionT1N1N2s[raceT1][raceT2] = [];
        }

        fissionT1N1N2s[raceT1][raceT2].push(raceT2);
      }
    }
  }

  const minLvlR = binRs[binR - 1] ? 3 * binRs[binR - 1] - lvlMod : 0;
  const maxLvlR = 3 * lvlR - lvlMod;

  for (const [raceT1, raceT2s] of Object.entries(fissionT1N1N2s)) {
    for (const lvlT1 of comp.getIngredientDemonLvls(raceT1)) {
      const name1 = comp.reverseLookupDemon(raceT1, lvlT1);
      const clvlT1 = comp.getDemon(name1).currLvl;

      if (name1 !== nameR) {
        const minLvlT2 = minLvlR - lvlT1;
        const maxLvlT2 = maxLvlR - lvlT1;

        for (const [raceN1, raceN2s] of Object.entries(raceT2s)) {
          for (const lvlN1 of comp.getIngredientDemonLvls(raceN1)) {
            const name2 = comp.reverseLookupDemon(raceN1, lvlN1);
            const clvlN1 = comp.getDemon(name2).currLvl;

            if (
              name2 !== name1 &&
              name2 !== nameR &&
              (clvlT1 > clvlN1 || (clvlT1 === clvlN1 && raceOrder[raceT1] < raceOrder[raceN1]))
            ) {
              const minLvlN2 = minLvlT2 - lvlN1;
              const maxLvlN2 = maxLvlT2 - lvlN1;

              for (const raceN2 of raceN2s) {
                for (const lvlN2 of comp.getIngredientDemonLvls(raceN2)) {
                  const name3 = comp.reverseLookupDemon(raceN2, lvlN2);
                  const clvlN2 = comp.getDemon(name3).currLvl;

                  if (
                    name3 !== name2 &&
                    name3 !== name1 &&
                    name3 !== nameR &&
                    (raceN1 !== raceN2 || lvlN1 < lvlN2) &&
                    (clvlT1 > clvlN2 || (clvlT1 === clvlN2 && raceOrder[raceT1] < raceOrder[raceN2]))
                  ) {
                    if (minLvlN2 < lvlN2 && lvlN2 <= maxLvlN2) {
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

export function splitWithSameRace(nameR: string, comp: Compendium, chart: SquareChart): NameTrio[] {
  const { normalChart: normChart, tripleChart: trioChart } = chart;
  const { race: raceR, lvl: lvlR } = comp.getDemon(nameR);
  const lvlMod = trioChart.lvlModifier;
  const recipes: NameTrio[] = [];

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

        const lvlRp = (lvlT1 + lvlN1 + lvlN2) / 3 + lvlMod;
        const binR = findBin(lvlRp, binRs);

        if (binR !== -1 && binRs[binR] === lvlR) {
          recipes.push({ name1, name2, name3 });
        }
      }
    }
  }

  return recipes;
}

export function splitWithPrevLvl(nameR: string, comp: Compendium, chart: SquareChart): NameTrio[] {
  const { race: raceR, lvl: lvlR } = comp.getDemon(nameR);
  const lvlRs = comp.getResultDemonLvls(raceR).slice();

  if (0 < lvlRs.indexOf(lvlR)) {
    const prevNameR = comp.reverseLookupDemon(raceR, lvlRs[lvlRs.indexOf(lvlR) - 1]);
    const rankUpRs: NameTrio[] = [].concat(
      fuseT1WithDiffRace(prevNameR, comp, chart).filter(trio => trio.name3 === nameR),
      fuseN1WithDiffRace(prevNameR, comp, chart).filter(trio => trio.name3 === nameR)
    );

    return rankUpRs.map(trio => ({ name1: trio.name1, name2: trio.name2, name3: prevNameR }));
  } else {
    return [];
  }
}

export function splitWithElementPair(name: string, comp: Compendium, chart: SquareChart): NameTrio[] {
  return splitWithElement(name, comp, chart.tripleChart).map(pair => {
    const [name2, name3] = pair.name2.split(' x ');
    return { name1: pair.name1, name2, name3 };
  });
}
