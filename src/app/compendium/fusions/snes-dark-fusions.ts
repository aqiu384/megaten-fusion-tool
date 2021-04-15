import { NamePair, Compendium, FusionChart } from '../models';

export function splitWithDarkRace(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const { race: raceR, lvl: lvlR } = compendium.getDemon(name);
  const lvlAs = [0, 0].concat(compendium.getResultDemonLvls(raceR), [100, 100]);
  const indR = lvlAs.indexOf(lvlR);
  const recipes: NamePair[] = [];

  if (fusionChart.getLightDark(raceR) < 0 || indR === -1) {
    return recipes;
  }

  const lvlA7 = lvlAs[indR - 2];
  const lvlA5 = lvlAs[indR - 1];
  const lvlA3 = lvlAs[indR + 1];

  const nameA7 = lvlA7 !== 0 ? compendium.reverseLookupDemon(raceR, lvlA7) : '';
  const nameA5 = lvlA5 !== 0 ? compendium.reverseLookupDemon(raceR, lvlA5) : '';
  const nameA3 = lvlA3 !== 100 ? compendium.reverseLookupDemon(raceR, lvlA3) : '';

  for (const raceB of fusionChart.races) {
    if (fusionChart.getLightDark(raceB) < 0) {
      for (const lvlB of compendium.getIngredientDemonLvls(raceB)) {
        const nameB = compendium.reverseLookupDemon(raceB, lvlB);
        if (lvlA7 >= lvlB && (lvlA7 + lvlB) % 7 === 0) { recipes.push({ name1: nameA7, name2: nameB }); }
        if (lvlA5 >= lvlB && (lvlA5 + lvlB) % 7 !== 0 && (lvlA5 + lvlB) % 5 === 0) { recipes.push({ name1: nameA5, name2: nameB }); }
        if (lvlA3 >= lvlB && (lvlA3 + lvlB) % 7 !== 0 && (lvlA3 + lvlB) % 5 !== 0 && (lvlA3 + lvlB) % 3 === 0) { recipes.push({ name1: nameA3, name2: nameB }); }
      }
    }
  }

  return recipes.filter(r => r.name1 !== '');
}

export function fuseWithDarkRace(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const { race: raceA, lvl: lvlA } = compendium.getDemon(name);
  const lvlRs = [0, 0].concat(compendium.getResultDemonLvls(raceA), [100, 100]);
  const indA = lvlRs.indexOf(lvlA);
  const recipes: NamePair[] = [];

  if (fusionChart.getLightDark(raceA) < 0 || indA === -1) {
    return recipes;
  }

  const lvlR7 = lvlRs[indA + 2];
  const lvlR5 = lvlRs[indA + 1];
  const lvlR3 = lvlRs[indA - 1];

  const nameR7 = lvlR7 !== 100 ? compendium.reverseLookupDemon(raceA, lvlR7) : '';
  const nameR5 = lvlR5 !== 100 ? compendium.reverseLookupDemon(raceA, lvlR5) : '';
  const nameR3 = lvlR3 !== 0 ? compendium.reverseLookupDemon(raceA, lvlR3) : '';

  for (const raceB of fusionChart.races) {
    if (fusionChart.getLightDark(raceB) < 0) {
      const lvlBs = compendium.getIngredientDemonLvls(raceB);

      for (let indB = 0; indB < lvlBs.length; indB++) {
        const lvlB = lvlBs[indB];
        const nameB = compendium.reverseLookupDemon(raceB, lvlB);

        if (lvlA >= lvlB) {
          if ((lvlA + lvlB) % 7 === 0) { recipes.push({ name1: nameB, name2: nameR7 }); }
          else if ((lvlA + lvlB) % 5 === 0) { recipes.push({ name1: nameB, name2: nameR5 }); }
          else if ((lvlA + lvlB) % 3 === 0) { recipes.push({ name1: nameB, name2: nameR3 }); }
          else if ((lvlA + lvlB) % 2 === 0 && indB > 0) { recipes.push({ name1: nameB, name2: compendium.reverseLookupDemon(raceB, lvlBs[indB - 1]) }); }
        } else {
          if ((lvlA + lvlB) % 2 === 0 && indB < lvlBs.length - 1) { recipes.push({ name1: nameB, name2: compendium.reverseLookupDemon(raceB, lvlBs[indB + 1]) }); }
          else if ((lvlA + lvlB) % 2 === 1) { recipes.push({ name1: nameB, name2: 'Slime' }); }
        }
      }
    }
  }

  return recipes.filter(r => r.name2 !== '');
}
