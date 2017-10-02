import { FusionTypes } from '../../compendium/constants';
import { FusionRow, FusionRecipe } from '../../compendium/models';
import { Compendium } from './compendium';
import { FusionChart } from './fusion-chart';

function calculateNormalRecipes(name: string, compendium: Compendium, fusionChart: FusionChart): FusionRecipe[] {
  const recipes: FusionRecipe[] = [];
  const { race: targetRace, lvl: targetLvl } = compendium.getDemon(name);

  const resultLvls = compendium.getResultDemonLvls(targetRace);
  const targetLvlIndex = resultLvls.indexOf(targetLvl);

  const minResultLvl = resultLvls[targetLvlIndex - 1] ? 2 * resultLvls[targetLvlIndex - 1] : 0;
  const maxResultLvl = resultLvls[targetLvlIndex + 1] ? 2 * targetLvl : 200;

  for (const combo of fusionChart.getReverseFusionCombos(targetRace)) {
    for (const ingLvl1 of compendium.getIngredientDemonLvls(combo.ingRace1)) {
      for (const ingLvl2 of compendium.getIngredientDemonLvls(combo.ingRace2)) {
        if (minResultLvl < ingLvl1 + ingLvl2 && ingLvl1 + ingLvl2 <= maxResultLvl) {
          recipes.push({
            name1: compendium.reverseLookupDemon(combo.ingRace1, ingLvl1),
            name2: compendium.reverseLookupDemon(combo.ingRace2, ingLvl2)
          });
        }
      }
    }
  }

  return recipes;
}

function calculateSameRaceRecipes(name: string, compendium: Compendium, fusionChart: FusionChart): FusionRecipe[] {
  const recipes: FusionRecipe[] = [];
  const { race: targetRace, lvl: targetLvl } = compendium.getDemon(name);

  const resultLvls = compendium.getResultDemonLvls(targetRace);
  const targetLvlIndex = resultLvls.indexOf(targetLvl);

  const minResultLvl = 2 * targetLvl;
  const maxResultLvl = resultLvls[targetLvlIndex + 1] ? 2 * resultLvls[targetLvlIndex + 1] : 200;
  const nextResultLvl = resultLvls[targetLvlIndex + 2] ? 2 * resultLvls[targetLvlIndex + 2] : 200;

  const ingLvls = compendium.getIngredientDemonLvls(targetRace).filter(lvl => lvl !== targetLvl);

  for (const ingLvl2 of ingLvls) {
    if (maxResultLvl / 2 < ingLvl2 && ingLvl2 + maxResultLvl / 2 < nextResultLvl) {
      recipes.push({
        name1: compendium.reverseLookupDemon(targetRace, maxResultLvl / 2),
        name2: compendium.reverseLookupDemon(targetRace, ingLvl2)
      });
    }
  }

  for (let ingLvlIndex1 = 0; ingLvlIndex1 < ingLvls.length; ingLvlIndex1++) {
    const ingLvl1 = ingLvls[ingLvlIndex1];

    for (let ingLvlIndex2 = ingLvlIndex1 + 1; ingLvlIndex2 < ingLvls.length; ingLvlIndex2++) {
      const ingLvl2 = ingLvls[ingLvlIndex2];

      if (minResultLvl <= ingLvl1 + ingLvl2 && ingLvl1 + ingLvl2 < maxResultLvl) {
        recipes.push({
          name1: compendium.reverseLookupDemon(targetRace, ingLvl1),
          name2: compendium.reverseLookupDemon(targetRace, ingLvl2)
        });
      }
    }
  }

  return recipes;
}

function calculateElementRecipes(name: string, compendium: Compendium, fusionChart: FusionChart): FusionRecipe[] {
  const recipes: FusionRecipe[] = [];
  const { race: targetRace, lvl: targetLvl } = compendium.getDemon(name);

  const elementModifiers = fusionChart.getElementModifiers(targetRace);
  const elementOffsets = Object.keys(elementModifiers).map(x => parseInt(x, 10));

  const baseResultLvls = [0, 0].concat(compendium.getResultDemonLvls(targetRace), [100, 100]);

  const elementRecipes: { ingName: string, elementOffset: number }[] = [];

  for (const ingLvl of compendium.getIngredientDemonLvls(targetRace)) {
    const resultLvls = baseResultLvls.slice();

    if (resultLvls.indexOf(ingLvl) < 0) {
      resultLvls.push(ingLvl);
      resultLvls.sort((a, b) => a - b);
    }

    const ingLvlIndex = resultLvls.indexOf(ingLvl);

    for (const elementOffset of elementOffsets) {
      if (resultLvls[ingLvlIndex + elementOffset] === targetLvl) {
        elementRecipes.push({
          ingName: compendium.reverseLookupDemon(targetRace, ingLvl),
          elementOffset
        });
      }
    }
  }

  for (const elementRecipe of elementRecipes) {
    for (const elementName of elementModifiers[elementRecipe.elementOffset]) {
      recipes.push({
        name1: elementRecipe.ingName,
        name2: elementName
      });
    }
  }

  return recipes;
}

function calculateRecipes(name: string, compendium: Compendium, fusionChart: FusionChart): { type: string, data: any[] } {
  if (compendium.isRecruitmentOnly(name)) {
    return { type: FusionTypes.Recruit, data: [] };
  }

  if (compendium.isExcludedDemon(name)) {
    return { type: FusionTypes.NotOwned, data: [] };
  }

  const ingredients = compendium.getSpecialFusionIngredients(name);
  if (ingredients.length > 0) {
    return { type: FusionTypes.Special, data: ingredients };
  }

  return {
    type: FusionTypes.Normal,
    data: [].concat(
      calculateNormalRecipes(name, compendium, fusionChart),
      calculateSameRaceRecipes(name, compendium, fusionChart),
      calculateElementRecipes(name, compendium, fusionChart)
    )
  };
}

export function calculateReverseFusions(
  name: string, compendium: Compendium, fusionChart: FusionChart):
  { type: string, data: FusionRow[] } {
  const { type, data } = calculateRecipes(name, compendium, fusionChart);
  const recipes: FusionRow[] = [];

  switch (type) {
    case FusionTypes.Normal:
      for (const recipe of data) {
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
      break;
    case FusionTypes.Special:
      for (const ingredient of data) {
        const demon = compendium.getDemon(ingredient);

        recipes.push({
          race1: demon.race,
          lvl1: demon.lvl,
          name1: ingredient,
          race2: '',
          lvl2: 0,
          name2: ''
        });
      }
      break;
    case FusionTypes.Recruit:
    case FusionTypes.NotOwned:
    default:
      break;
  }

  return { type, data: recipes };
}
