import { Compendium, FusionChart, NamePair, SquareChart, NameTrio } from '../models';

const LIGHT_INGREDIENTS_RACES = [ 'Deity', 'Megami', 'Fury', 'Lady' ];
const DARK_INGREDIENTS_RACES = [ 'Vile', 'Tyrant', 'Reaper' ];
const RESULT_RACES = [ 'Entity', 'Zealot' ];

export function splitNormal(nameR: string, comp: Compendium, chart: FusionChart): NamePair[] {
  const recipes: NamePair[] = [];
  const { race: raceR, lvl: lvlR } = comp.getDemon(nameR);
  const lvlMod = 2 * (chart.lvlModifier - 3);

  const binRs = comp.getResultDemonLvls(raceR);
  const binR = binRs.indexOf(lvlR);

  if (RESULT_RACES.indexOf(raceR) === -1 || binR === -1) {
    return recipes;
  }

  const minLvlR = binRs[binR - 1] ? 2 * binRs[binR - 1] - lvlMod : 0;
  const maxLvlR = binRs[binR + 1] ? 2 * lvlR - lvlMod : 200;

  for (const raceL of LIGHT_INGREDIENTS_RACES) {
    for (const lvlL of comp.getIngredientDemonLvls(raceL)) {
      const name1 = comp.reverseLookupDemon(raceL, lvlL);
      const minLvlD = minLvlR - lvlL;
      const maxLvlD = maxLvlR - lvlL;

      for (const raceD of DARK_INGREDIENTS_RACES) {
        for (const lvlD of comp.getIngredientDemonLvls(raceD)) {
          const name2 = comp.reverseLookupDemon(raceD, lvlD);

          if (minLvlD < lvlD && lvlD <= maxLvlD) {
            recipes.push({ name1, name2 });
          }
        }
      }
    }
  }

  return recipes;
}

export function splitTriple(nameR: string, comp: Compendium, chart: SquareChart): NameTrio[] {
  const recipes: NameTrio[] = [];
  const { race: raceR, lvl: lvlR } = comp.getDemon(nameR);
  const lvlMod = 3 * (chart.tripleChart.lvlModifier - 1);

  const binRs = comp.getResultDemonLvls(raceR);
  const binR = binRs.indexOf(lvlR);

  if (RESULT_RACES.indexOf(raceR) === -1 || binR === -1) {
    return recipes;
  }

  const minLvlR = binRs[binR - 1] ? 3 * binRs[binR - 1] - lvlMod : 0;
  const maxLvlR = 3 * lvlR - lvlMod;

  for (const raceL of LIGHT_INGREDIENTS_RACES) {
    for (const lvlL of comp.getIngredientDemonLvls(raceL)) {
      const name1 = comp.reverseLookupDemon(raceL, lvlL);
      const minLvlT2 = minLvlR - lvlL;
      const maxLvlT2 = maxLvlR - lvlL;

      for (const raceD of DARK_INGREDIENTS_RACES) {
        for (const lvlD of comp.getIngredientDemonLvls(raceD)) {
          const name2 = comp.reverseLookupDemon(raceD, lvlD);
          const minLvl3 = minLvlT2 - lvlD;
          const maxLvl3 = maxLvlT2 - lvlD;

          for (const race3 of LIGHT_INGREDIENTS_RACES) {
            for (const lvl3 of comp.getIngredientDemonLvls(race3)) {
              const name3 = comp.reverseLookupDemon(race3, lvl3);

              if (minLvl3 < lvl3 && lvl3 <= maxLvl3 && name1.localeCompare(name3) < 0) {
                recipes.push({ name1, name2, name3 });
              }
            }
          }

          for (const race3 of DARK_INGREDIENTS_RACES) {
            for (const lvl3 of comp.getIngredientDemonLvls(race3)) {
              const name3 = comp.reverseLookupDemon(race3, lvl3);

              if (minLvl3 < lvl3 && lvl3 <= maxLvl3 && name2.localeCompare(name3) < 0) {
                recipes.push({ name1, name2, name3 });
              }
            }
          }
        }
      }
    }
  }

  return recipes;
}
