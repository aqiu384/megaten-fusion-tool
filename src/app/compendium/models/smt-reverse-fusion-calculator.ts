import { FusionTypes } from '../../compendium/constants';
import { FusionRow, FusionRecipe, Compendium, FusionChart } from '../../compendium/models';

function calculateNormalRecipes(name: string, compendium: Compendium, fusionChart: FusionChart): FusionRecipe[] {
  const recipes: FusionRecipe[] = [];
  const { race: targetRace, lvl: targetLvl } = compendium.getDemon(name);

  const resultLvls = compendium.getResultDemonLvls(targetRace);
  const targetLvlIndex = resultLvls.indexOf(targetLvl);

  const minResultLvl = resultLvls[targetLvlIndex - 1] ?
    2 * (resultLvls[targetLvlIndex - 1] - fusionChart.lvlModifier) : 0;
  const maxResultLvl = resultLvls[targetLvlIndex + 1] ?
    2 * (targetLvl - fusionChart.lvlModifier) : 200;

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

function calculateNormalElementRecipes(name: string, compendium: Compendium, fusionChart: FusionChart): FusionRecipe[] {
  const recipes: FusionRecipe[] = [];
  const { race: targetRace } = compendium.getDemon(name);

  if (targetRace === 'Mitama') {
    for (const combo of compendium.getSpecialFusionIngredients(name)) {
      const [name1, name2] = combo.split(' x ');
      recipes.push({ name1, name2 });
    }
  } else {
    for (const { ingRace1, ingRace2 } of fusionChart.getReverseFusionCombos(name)) {
      const ingLvls1 = compendium.getIngredientDemonLvls(ingRace1);
      for (let i = 0; i < ingLvls1.length; i++) {
        for (let j = i + 1; j < ingLvls1.length; j++) {
          recipes.push({
            name1: compendium.reverseLookupDemon(ingRace1, ingLvls1[i]),
            name2: compendium.reverseLookupDemon(ingRace1, ingLvls1[j]),
          });
        }
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
  if (compendium.isElementDemon(name)) {
    return {
      type: FusionTypes.Normal,
      data: calculateNormalElementRecipes(name, compendium, fusionChart)
    };
  }

  const { fusion } = compendium.getDemon(name);

  switch (fusion) {
    case FusionTypes.Normal:
      return {
        type: fusion,
        data: [].concat(
          calculateNormalRecipes(name, compendium, fusionChart),
          calculateElementRecipes(name, compendium, fusionChart)
        )
      };
    default:
      return {
        type: fusion,
        data: compendium.getSpecialFusionIngredients(name)
      };
  }
}

export function calculateReverseFusions(
  name: string, compendium: Compendium, fusionChart: FusionChart
): { type: string, data: FusionRow[] } {
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
    default:
      break;
  }

  return { type, data: recipes };
}
