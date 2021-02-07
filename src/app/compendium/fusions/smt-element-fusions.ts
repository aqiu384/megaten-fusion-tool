import { NamePair, Compendium, FusionChart } from '../models';

export function fuseWithNormResult(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const recipes: NamePair[] = [];

  for (const [ ingRace, resultModifier ] of Object.entries(fusionChart.getElemFusions(name))) {
    const ingLvls = compendium.getResultDemonLvls(ingRace).filter(lvl => lvl < 100);
    const ingLvls2 = resultModifier < 0 ? ingLvls.slice(-1 * resultModifier) : ingLvls.slice(0, -1 * resultModifier);
    const resultLvls = resultModifier < 0 ? ingLvls.slice(0, resultModifier) : ingLvls.slice(resultModifier);

    for (let index = 0; index < ingLvls2.length; index++) {
      recipes.push({
        name1: compendium.reverseLookupDemon(ingRace, ingLvls2[index]),
        name2: compendium.reverseLookupDemon(ingRace, resultLvls[index])
      });
    }
  }

  return recipes;
}

export function fuseWithSpecResult(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const recipes: NamePair[] = [];
  const elementResults = fusionChart.getElemFusions(name);

  for (const { race: ingRace2, lvl: ingLvl2, name: ingName2 } of compendium.specialDemons) {
    const resultModifier = elementResults[ingRace2];

    if (resultModifier) {
      const findResultLevelFun = (index, resultLvl) => ingLvl2 > resultLvl ? index + 1 : index;
      const resultLvls = compendium.getResultDemonLvls(ingRace2).filter(lvl => lvl < 100);
      const resultLvlIndex = resultModifier + resultLvls.reduce(findResultLevelFun, 0);

      if (0 < resultLvlIndex && resultLvlIndex < resultLvls.length) {
        recipes.push({
          name1: ingName2,
          name2: compendium.reverseLookupDemon(ingRace2, resultLvls[resultLvlIndex])
        });
      }
    }
  }

  return recipes;
}

export function fuseTwoElements(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  return [];
}
