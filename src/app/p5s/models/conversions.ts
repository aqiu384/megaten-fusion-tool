import { Compendium } from '../../compendium/models';

export function getLowerIngredients(name: string, compendium: Compendium): string[] {
  const { race, lvl } = compendium.getDemon(name);
  return compendium.getIngredientDemonLvls(race).filter(l => l <= lvl).map(l => compendium.reverseLookupDemon(race, l));
}

export function getHigherIngredients(name: string, compendium: Compendium): string[] {
  const { race, lvl } = compendium.getDemon(name);
  return compendium.getIngredientDemonLvls(race).filter(l => lvl <= l).map(l => compendium.reverseLookupDemon(race, l));
}
