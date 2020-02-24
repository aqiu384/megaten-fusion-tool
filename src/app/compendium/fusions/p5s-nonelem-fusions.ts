import { Compendium, FusionChart, NamePair } from '../models';

export function splitNormal(nameR: string, comp: Compendium, chart: FusionChart): NamePair[] {
  const recipes: NamePair[] = [];

  for (const recipe of comp.getSpecialNamePairs(nameR)) {
    recipes.push(recipe);
  }

  return recipes;
}

export function fuseNormal(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const recipes: NamePair[] = [];

  for (const { result, recipe } of compendium.reverseLookupSpecial(name)) {
    const ingName2 = recipe.split(' x ').filter(ing => ing !== name)[0];
    recipes.push({ name1: ingName2, name2: result });
  }

  return recipes;
}