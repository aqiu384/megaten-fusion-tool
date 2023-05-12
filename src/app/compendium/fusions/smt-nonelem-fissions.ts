import { NamePair, Compendium, FusionChart } from '../models';

export function splitWithDiffRace(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const recipes: NamePair[] = [];
  const specials = compendium.getSpecialNamePairs(name);

  if (specials.length > 0) {
    if (specials[0].name1 === specials[0].name2) { name = specials[0].name1; }
    else if (name !== specials[0].name1) { return specials; }
  }

  const { race: targetRace, lvl: targetLvl } = compendium.getDemon(name);
  const resultLvls = compendium.getResultDemonLvls(targetRace);
  const targetLvlIndex = resultLvls.indexOf(targetLvl);

  if (targetLvlIndex === -1) {
    return [ ];
  }

  const minResultLvl = resultLvls[targetLvlIndex - 1] ?
    2 * (resultLvls[targetLvlIndex - 1] - fusionChart.lvlModifier) : 0;
  const maxResultLvl = resultLvls[targetLvlIndex + 1] ?
    2 * (targetLvl - fusionChart.lvlModifier) : 200;

  for (const [raceA, raceBs] of Object.entries(fusionChart.getRaceFissions(targetRace))) {
    for (const lvlA of compendium.getIngredientDemonLvls(raceA)) {
      const minLvlB = minResultLvl - lvlA;
      const maxLvlB = maxResultLvl - lvlA;

      for (const raceB of raceBs) {
        for (const lvlB of compendium.getIngredientDemonLvls(raceB)) {
          if (minLvlB < lvlB && lvlB <= maxLvlB && (raceA != raceB || lvlA < lvlB)) {
            recipes.push({
              name1: compendium.reverseLookupDemon(raceA, lvlA),
              name2: compendium.reverseLookupDemon(raceB, lvlB)
            });
          }
        }
      }
    }
  }

  return recipes;
}

export function splitWithSpecies(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const recipes: NamePair[] = [];

  const { race: targetRace, lvl: targetLvl } = compendium.getDemon(name);
  const twoSpecies = Object.keys(fusionChart.getRaceFissions(targetRace)).find(s => s.charAt(0) === '2');

  if (!twoSpecies) { return recipes; }

  const targetSpecies = twoSpecies.substring(1);
  const resultLvls = compendium.getResultDemonLvls(targetSpecies);
  const targetLvlIndex = resultLvls.indexOf(targetLvl);

  if (targetLvlIndex === -1) { return recipes; }

  const pr1ResultLvl = resultLvls[targetLvlIndex - 2] || 0;
  const pr2ResultLvl = resultLvls[targetLvlIndex - 1] || 0;
  const maxResultLvl = resultLvls[targetLvlIndex + 1] ? 2 * targetLvl : 200;

  for (const [raceA, raceBs] of Object.entries(fusionChart.getRaceFissions(targetSpecies))) {
    for (const lvlA of compendium.getIngredientDemonLvls(raceA).filter(lvl => lvl !== targetLvl)) {
      for (const raceB of raceBs) {
        for (const lvlB of compendium.getIngredientDemonLvls(raceB).filter(lvl => lvl !== targetLvl)) {
          const minResultLvl = (lvlA === pr2ResultLvl || lvlB === pr2ResultLvl) ? pr1ResultLvl : pr2ResultLvl;
          const resultLvl = lvlA + lvlB + fusionChart.lvlModifier;

          if (2 * minResultLvl < resultLvl && resultLvl <= maxResultLvl) {
            recipes.push({
              name1: compendium.reverseLookupDemon(raceA, lvlA),
              name2: compendium.reverseLookupDemon(raceB, lvlB)
            });
          }
        }
      }
    }
  }

  return recipes;
}

export function splitWithElement(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const { race: targetRace, lvl: targetLvl } = compendium.getDemon(name);
  const recipes: NamePair[] = [];

  const elementModifiers = fusionChart.getElemModifiers(targetRace);
  const elementOffsets = Object.keys(elementModifiers).map(x => parseInt(x, 10));

  if (compendium.getSpecialNamePairs(name).length || !elementOffsets.length) {
    return recipes;
  }

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

export function splitWithTotem(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const recipes: NamePair[] = [];
  const specials = compendium.getSpecialNamePairs(name);

  if (specials.length === 0 || name !== specials[0].name1) {
    return recipes;
  }

  const targetRace = compendium.getDemon(specials[0].name2).race;

  for (const [raceA, raceBs] of Object.entries(fusionChart.getRaceFissions(targetRace))) {
    for (const lvlA of compendium.getIngredientDemonLvls(raceA)) {
      for (const raceB of raceBs) {
        for (const lvlB of compendium.getIngredientDemonLvls(raceB)) {
          recipes.push({
            name1: compendium.reverseLookupDemon(raceA, lvlA),
            name2: compendium.reverseLookupDemon(raceB, lvlB)
          });
        }
      }
    }
  }

  return recipes;
}
