import { Compendium, NameTrio, SquareChart } from '../models';
import { fuseWithNormResult, fuseWithSpecResult } from './smt-element-fusions';

export function fuseInElementPair(elem: string, comp: Compendium, chart: SquareChart): NameTrio[] {
  const elemPairs = chart.tripleChart.elementDemons.filter(pair => pair.indexOf(elem) > -1);
  let recipes: NameTrio[] = [];

  for (const pair of elemPairs) {
    const name1 = pair.replace(elem, '').replace(' x ', '');
    const recipePairs = fuseWithNormResult(pair, comp, chart.tripleChart)
      .concat(fuseWithSpecResult(pair, comp, chart.tripleChart));

    recipes = recipes.concat(recipePairs.map(recipe => ({ name1, name2: recipe.name1, name3: recipe.name2 })));
  }

  return recipes;
}
