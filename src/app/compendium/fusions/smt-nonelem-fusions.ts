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
        recipes.push({
          name1: compendium.reverseLookupDemon(raceB, lvlB),
          name2: compendium.reverseLookupDemon(raceR, lvlsR[binB])
        });
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

export function getDarkOffsets(name: string, comp: Compendium, chart: FusionChart): ElemModifiers {
  const { race: raceA, lvl: lvlA } = comp.getDemon(name);
  const isDarkA = chart.getLightDark(raceA) === -1;
  const darkLvlA = isDarkA ? -1 * lvlA : lvlA;
  const mods = <ElemModifiers>{ '2': [], '1': [], '-1': [] };

  const remainA7 = (7 - lvlA % 7) % 7;
  const remainA5 = (5 - lvlA % 5) % 5;
  const remainA3 = (3 - lvlA % 3) % 3;

  for (const demonB of comp.allDemons) {
    const { name: nameB, race: raceB, lvl: lvlB } = demonB;
    const isDarkB = chart.getLightDark(raceB) === -1;
    const darkLvlB = isDarkB ? -1 * lvlB : lvlB;

    if (isDarkA === isDarkB || darkLvlA + darkLvlB < 0 || comp.isElementDemon(nameB)) {
      continue;
    } else if (lvlB % 7 === remainA7) {
      mods[2].push(nameB);
    } else if (lvlB % 5 === remainA5) {
      mods[1].push(nameB);
    } else if (lvlB % 3 === remainA3) {
      mods[-1].push(nameB);
    }
  }

  return mods;
}

export function fuseLightDark(name: string, comp: Compendium, chart: FusionChart): NamePair[] {
  const { race: raceA, lvl: lvlA } = comp.getDemon(name);
  const isDarkA = chart.getLightDark(raceA) === -1;
  const pairs = <NamePair[]>[];

  if (isDarkA) {
    return pairs;
  }

  const lvlRs = [0, 0].concat(comp.getResultDemonLvls(raceA), [100, 100]);
  if (lvlRs.indexOf(lvlA) < 0) {
    lvlRs.push(lvlA);
    lvlRs.sort((a, b) => a - b);
  }

  const lvlIndexA1 = lvlRs.indexOf(lvlA);
  const elementModifiers = getDarkOffsets(name, comp, chart);
  const elementOffsets = Object.keys(elementModifiers).map(x => parseInt(x, 10));

  for (const offset of elementOffsets) {
    const lvlR = lvlRs[lvlIndexA1 + offset];

    if (lvlR !== 0 && lvlR !== 100) {
      const nameR = comp.reverseLookupDemon(raceA, lvlR);

      for (const nameE of elementModifiers[offset]) {
        pairs.push({
          name1: nameE,
          name2: nameR
        });
      }
    }
  }

  return pairs;
}
