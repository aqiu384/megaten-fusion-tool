import { NamePair, Compendium, FusionChart } from '../models';

export function splitWithSameRace(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const { race: targetRace, lvl: targetLvl } = compendium.getDemon(name);
  const recipes: NamePair[] = [];

  if (compendium.getSpecialNameEntries(name).length) {
    return recipes;
  }

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

export function splitWithElement(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const recipes: NamePair[] = [];
  const { race: targetRace, lvl: targetLvl } = compendium.getDemon(name);

  const elementModifiers = fusionChart.getElemModifiers(targetRace);
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
