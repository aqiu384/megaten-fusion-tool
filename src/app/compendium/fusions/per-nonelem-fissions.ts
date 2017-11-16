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
