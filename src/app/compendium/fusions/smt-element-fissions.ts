import { NamePair, Compendium, FusionChart } from '../models';

export function splitElement(element: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const recipes = compendium.getSpecialNamePairs(element).slice();

  for (const [raceA, raceAs] of Object.entries(fusionChart.getRaceFissions(element))) {
    const ingLvls1 = compendium.getIngredientDemonLvls(raceA);
    for (let i = 0; i < ingLvls1.length; i++) {
      for (let j = i + 1; j < ingLvls1.length; j++) {
        recipes.push({
          name1: compendium.reverseLookupDemon(raceA, ingLvls1[i]),
          name2: compendium.reverseLookupDemon(raceA, ingLvls1[j]),
        });
      }
    }
  }

  return recipes;
}
