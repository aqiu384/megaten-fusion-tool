import { NamePair, Compendium, FusionChart } from '../models';

export function fuseTwoElements(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const recipes: NamePair[] = [];
  const { race: ingRace1, lvl: ingLvl1 } = compendium.getDemon(name);

  for (const ingName2 of fusionChart.elementDemons.filter(elem => elem !== name)) {
    const { race: ingRace2, lvl: ingLvl2 } = compendium.getDemon(ingName2);
    const resultRace = fusionChart.getRaceFusions(ingRace1)[ingRace2];

    const resultLvls = compendium.getResultDemonLvls(resultRace);
    const findResultLevelFun = (index, resultLvl) => ingLvl1 + ingLvl2 >= resultLvl * 2 ? index + 1 : index;
    const resultLvlIndex = resultLvls.reduce(findResultLevelFun, 0);

    const resultName = resultLvlIndex === resultLvls.length ?
      compendium.reverseLookupDemon(resultRace, resultLvls[resultLvls.length - 1]) :
      compendium.reverseLookupDemon(resultRace, resultLvls[resultLvlIndex]);

    recipes.push({
      name1: ingName2,
      name2: resultName
    });
  }

  return recipes;
}
