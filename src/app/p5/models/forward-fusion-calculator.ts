import { FusionRow, FusionRecipe } from '../../compendium/models';
import { Compendium } from './compendium';
import { FusionChart } from './fusion-chart';

function calculateNormalRecipes(name: string, compendium: Compendium, fusionChart: FusionChart): FusionRecipe[] {
  const recipes: FusionRecipe[] = [];
  const { race: ingRace1, lvl: ingLvl1 } = compendium.getDemon(name);

  for (const { ingRace2, resultRace } of fusionChart.getForwardFusionCombos(ingRace1)) {
    const ingLvls2 = compendium.getIngredientDemonLvls(ingRace2);
    const resultLvls = compendium.getResultDemonLvls(resultRace).map(lvl => lvl * 2);

    for (const ingLvl2 of ingLvls2) {
      const findResultLvlFun = (index, resultLvl) => ingLvl1 + ingLvl2 <= resultLvl ? index : index + 1;
      let resultLvlIndex = resultLvls.reduce(findResultLvlFun, 0);

      if (resultLvlIndex === resultLvls.length) {
        resultLvlIndex = resultLvls.length - 1;
      }

      recipes.push({
        name1: compendium.reverseLookupDemon(ingRace2, ingLvl2),
        name2: compendium.reverseLookupDemon(resultRace, resultLvls[resultLvlIndex] / 2)
      });
    }
  }

  const name1 = compendium.getNormalException(name);
  if (name1) {
    return recipes.filter(recipe => recipe.name1 !== name1);
  } else {
    return recipes;
  }
}

function calculateSameRaceRecipes(name: string, compendium: Compendium, fusionChart: FusionChart): FusionRecipe[] {
  const recipes: FusionRecipe[] = [];
  const { race: ingRace1, lvl: ingLvl1 } = compendium.getDemon(name);

  const ingLvls2 = compendium.getIngredientDemonLvls(ingRace1).filter(lvl => lvl !== ingLvl1);
  const resultLvls = compendium.getResultDemonLvls(ingRace1).filter(lvl => lvl !== ingLvl1).map(lvl => 2 * lvl);

  for (const ingLvl2 of ingLvls2) {
    const findResultLvlFun = (index, resultLvl) => ingLvl1 + ingLvl2 >= resultLvl ? index + 1 : index;
    let resultLvlIndex = resultLvls.reduce(findResultLvlFun, -1);

    if (resultLvls[resultLvlIndex] / 2 === ingLvl2) {
      resultLvlIndex = resultLvlIndex - 1;
    }

    const resultLvl = resultLvls[resultLvlIndex] / 2;
    if (resultLvl) {
      recipes.push({
        name1: compendium.reverseLookupDemon(ingRace1, ingLvl2),
        name2: compendium.reverseLookupDemon(ingRace1, resultLvl)
      });
    }
  }

  const name1 = compendium.getNormalException(name);
  if (name1) {
    return recipes.filter(recipe => recipe.name1 !== name1);
  } else {
    return recipes;
  }
}

function calculateElementRecipes(name: string, compendium: Compendium, fusionChart: FusionChart): FusionRecipe[] {
  const recipes: FusionRecipe[] = [];
  const { race: ingRace1, lvl: ingLvl1 } = compendium.getDemon(name);

  const resultLvls = [0, 0].concat(compendium.getResultDemonLvls(ingRace1), [100, 100]);
  if (resultLvls.indexOf(ingLvl1) < 0) {
    resultLvls.push(ingLvl1);
    resultLvls.sort((a, b) => a - b);
  }

  const ingLvlIndex1 = resultLvls.indexOf(ingLvl1);
  const elementModifiers = fusionChart.getElementModifiers(ingRace1);
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

function calculateNormalElementRecipes(name: string, compendium: Compendium, fusionChart: FusionChart): FusionRecipe[] {
  const recipes: FusionRecipe[] = [];

  for (const [ ingRace, resultModifier ] of Object.entries(fusionChart.getElementResults(name))) {
    const ingLvls = compendium.getResultDemonLvls(ingRace);
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

function calculateSpecialElementRecipes(name: string, compendium: Compendium, fusionChart: FusionChart): FusionRecipe[] {
  const recipes: FusionRecipe[] = [];
  const elementResults = fusionChart.getElementResults(name);

  for (const ingName2 of compendium.getSpecialFusionResults()) {
    const { race: ingRace2, lvl: ingLvl2 } = compendium.getDemon(ingName2);
    const resultModifier = elementResults[ingRace2];

    if (resultModifier) {
      const findResultLevelFun = (index, resultLvl) => ingLvl2 > resultLvl ? index + 1 : index;
      const resultLvls = compendium.getResultDemonLvls(ingRace2);
      const resultLvlIndex = resultModifier + resultLvls.reduce(findResultLevelFun, 0);

      if (resultLvlIndex < resultLvls.length) {
        recipes.push({
          name1: ingName2,
          name2: compendium.reverseLookupDemon(ingRace2, resultLvls[resultLvlIndex])
        });
      }
    }
  }

  return recipes;
}

function calculateDoubleElementRecipes(name: string, compendium: Compendium, fusionChart: FusionChart): FusionRecipe[] {
  const recipes: FusionRecipe[] = [];
  const { race: ingRace1, lvl: ingLvl1 } = compendium.getDemon(name);

  for (const ingName2 of compendium.getElementDemons(name)) {
    const { race: ingRace2, lvl: ingLvl2 } = compendium.getDemon(ingName2);
    const resultRace = fusionChart.getFusionResultRace(ingRace1, ingRace2);

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

function calculateRecipes(name: string, compendium: Compendium, fusionChart: FusionChart): FusionRecipe[] {
  if (compendium.isElementDemon(name)) {
    return [].concat(
      calculateNormalElementRecipes(name, compendium, fusionChart),
      calculateSpecialElementRecipes(name, compendium, fusionChart),
      calculateDoubleElementRecipes(name, compendium, fusionChart)
    );
  }

  return [].concat(
    calculateNormalRecipes(name, compendium, fusionChart),
    calculateSameRaceRecipes(name, compendium, fusionChart),
    calculateElementRecipes(name, compendium, fusionChart)
  );
}

export function calculateForwardFusions(name: string, compendium: Compendium, fusionChart: FusionChart): FusionRow[] {
  const rawRecipes = calculateRecipes(name, compendium, fusionChart);
  const recipes = [];

  for (const recipe of rawRecipes) {
    const demon1 = compendium.getDemon(recipe.name1);
    const demon2 = compendium.getDemon(recipe.name2);

    recipes.push({
      race1: demon1.race,
      lvl1: demon1.lvl,
      name1: recipe.name1,
      race2: demon2.race,
      lvl2: demon2.lvl,
      name2: recipe.name2
    });
  }

  return recipes;
}
