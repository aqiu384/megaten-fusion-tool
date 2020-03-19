import { Compendium, SquareChart, NameTrio } from '../models';

export function splitWithDiffRace(elem: string, comp: Compendium, chart: SquareChart): NameTrio[] {
  const { normalChart: normChart, tripleChart: trioChart, raceOrder } = chart;
  const recipes: NameTrio[] = [];

  for (const raceT1 of Object.keys(trioChart.getRaceFissions(elem))) {
    for (const lvlT1 of comp.getIngredientDemonLvls(raceT1)) {
      const name1 = comp.reverseLookupDemon(raceT1, lvlT1);

      for (const [raceN1, raceN2s] of Object.entries(normChart.getRaceFissions(raceT1))) {
        for (const lvlN1 of comp.getIngredientDemonLvls(raceN1)) {
          if (lvlT1 > lvlN1 || (lvlT1 === lvlN1 && raceOrder[raceT1] < raceOrder[raceN1])) {
            const name2 = comp.reverseLookupDemon(raceN1, lvlN1);

            for (const raceN2 of raceN2s) {
              for (const lvlN2 of comp.getIngredientDemonLvls(raceN2)) {
                if (lvlT1 > lvlN2 || (lvlT1 === lvlN2 && raceOrder[raceT1] < raceOrder[raceN2])) {
                  const name3 = comp.reverseLookupDemon(raceN2, lvlN2);

                  recipes.push({ name1, name2, name3 });
                }
              }
            }
          }
        }
      }
    }
  }

  return recipes;
}

export function splitWithSameRace(elem: string, comp: Compendium, chart: SquareChart): NameTrio[] {
  const { tripleChart: trioChart } = chart;
  const recipes: NameTrio[] = [];

  for (const raceT1 of Object.keys(trioChart.getRaceFissions(elem))) {
    const lvlT1s = comp.getIngredientDemonLvls(raceT1);

    for (let i = 0; i < lvlT1s.length; i++) {
      const name1 = comp.reverseLookupDemon(raceT1, lvlT1s[i]);

      for (let j = i + 1; j < lvlT1s.length; j++) {
        const name2 = comp.reverseLookupDemon(raceT1, lvlT1s[j]);

        for (let k = j + 1; k < lvlT1s.length; k++) {
          const name3 = comp.reverseLookupDemon(raceT1, lvlT1s[k]);

          recipes.push({ name1, name2, name3 });
        }
      }
    }
  }

  return recipes;
}
