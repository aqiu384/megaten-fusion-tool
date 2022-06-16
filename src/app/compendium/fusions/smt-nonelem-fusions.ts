import { NamePair, Compendium, FusionChart, ElemModifiers } from '../models';

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

  return index === bins.length ? index - 1 : index;
}

export function fuseWithDiffRace(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const recipes: NamePair[] = [];
  const { race: raceA, lvl: lvlA } = compendium.getDemon(name);

  for (const [raceB, raceR] of Object.entries(fusionChart.getRaceFusions(raceA))) {
    const lvlsR = compendium.getResultDemonLvls(raceR);
    const binsB = lvlsR.map(lvl => 2 * (lvl - fusionChart.lvlModifier) - lvlA);

    for (const lvlB of compendium.getIngredientDemonLvls(raceB)) {
      const binB = findBin(lvlB, binsB);

      if (binB !== -1 && lvlsR[binB] !== 100 && (raceA != raceB || lvlA != lvlB)) {
        const nameR = compendium.reverseLookupDemon(raceR, lvlsR[binB]);

        if (nameR === name && binB + 1 < lvlsR.length) {
          recipes.push({
            name1: compendium.reverseLookupDemon(raceB, lvlB),
            name2: compendium.reverseLookupDemon(raceR, lvlsR[binB + 1])
          });
        } else {
          recipes.push({
            name1: compendium.reverseLookupDemon(raceB, lvlB),
            name2: nameR
          });
        }
      }
    }
  }

  for (const name2 of compendium.reverseLookupSpecial(name)) {
    const specIngreds = compendium.getSpecialNameEntries(name2);

    if (specIngreds.length === 2) {
      const name1 = specIngreds[0] === name ? specIngreds[1] : specIngreds[0];

      for (const pair of recipes) {
        if (pair.name1 === name1) {
          pair.name2 = name2;
        }
      }
    }
  }

  return recipes;
}

export function fuseWithSameRace(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const { race: ingRace1, lvl: ingLvl1 } = compendium.getDemon(name);
  const elementResult = fusionChart.getRaceFusions(ingRace1)[ingRace1];
  const ingLvls2 = compendium.getIngredientDemonLvls(ingRace1).filter(lvl => lvl !== ingLvl1);
  const recipes: NamePair[] = [];

  if (elementResult && compendium.isElementDemon(elementResult)) {
    for (const ingLvl2 of ingLvls2) {
      recipes.push({
        name1: compendium.reverseLookupDemon(ingRace1, ingLvl2),
        name2: elementResult
      });
    }
  }

  return recipes;
}

export function fuseWithElement(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const recipes: NamePair[] = [];
  const { race: ingRace1, lvl: ingLvl1 } = compendium.getDemon(name);

  const resultLvls = [0, 0].concat(compendium.getResultDemonLvls(ingRace1), [100, 100]);
  if (resultLvls.indexOf(ingLvl1) < 0) {
    resultLvls.push(ingLvl1);
    resultLvls.sort((a, b) => a - b);
  }

  const ingLvlIndex1 = resultLvls.indexOf(ingLvl1);
  const elementModifiers = fusionChart.getElemModifiers(ingRace1);
  const elementOffsets = Object.keys(elementModifiers).map(x => parseInt(x, 10));

  for (const offset of elementOffsets) {
    const resultLvl = resultLvls[ingLvlIndex1 + offset];

    if (resultLvl !== 0 && resultLvl !== 100) {
      const resultName = compendium.reverseLookupDemon(ingRace1, resultLvl);

      for (const elementName of elementModifiers[offset]) {
        recipes.push({
          name1: elementName,
          name2: resultName
        });
      }
    }
  }

  return recipes;
}
