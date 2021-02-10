import { Compendium, FusionChart, SquareChart, NamePair, NameTrio } from '../models';

export function splitWithSameRace(nameR: string, comp: Compendium, chart: FusionChart): NamePair[] {
  const { race: raceR, lvl: lvlR } = comp.getDemon(nameR);
  const recipes: NamePair[] = [];

  const ingredLvls = comp.getIngredientDemonLvls(raceR);
  const nextInd = ingredLvls.indexOf(lvlR);
  const nextLvl = -1 < nextInd && nextInd < ingredLvls.length - 1 ? ingredLvls[nextInd + 1] : 0;
  const upperLvls = ingredLvls.filter(l => nextLvl < l);

  if (nextLvl) {
    for (const upLvl of upperLvls) {
      recipes.push({
        name1: comp.reverseLookupDemon(raceR, nextLvl),
        name2: comp.reverseLookupDemon(raceR, upLvl)
      })
    }
  }

  for (const { name1, name2 } of comp.getSpecialNamePairs(nameR)) {
    if (name2 === 'Valjean' && nextLvl) {
      recipes.push({ name1: comp.reverseLookupDemon(raceR, nextLvl), name2: name1 });
    }
  }

  return recipes;
}

export function fuseWithSameRace(name1: string, comp: Compendium, chart: FusionChart): NamePair[] {
  const { race: race1, lvl: lvl1 } = comp.getDemon(name1);
  const recipes: NamePair[] = [];

  const lowerResults = comp.getIngredientDemonLvls(race1).filter(l => l < lvl1).map(l => comp.reverseLookupDemon(race1, l));
  const forwardResults = lowerResults.concat(comp.reverseLookupSpecial(name1));

  for (const nameR of forwardResults) {
    for (const rec of splitWithSameRace(nameR, comp, chart)) {
      if (rec.name1 === name1) {
        recipes.push({ name1: rec.name2, name2: nameR });
      } else if (rec.name2 === name1) {
        recipes.push({ name1: rec.name1, name2: nameR });
      }
    }
  }

  return recipes;
}

export function splitWithDiffRace(nameR: string, comp: Compendium, chart: SquareChart): NameTrio[] {
  const recipes: NameTrio[] = [];

  const nameEntries = comp.getSpecialNameEntries(nameR);
  const namePairs = comp.getSpecialNamePairs(nameR);
  const tripleLen = Math.min(nameEntries.length, namePairs.length);

  for (let i = 0; i < tripleLen; i++) {
    const { name1, name2 } = namePairs[i];

    if (name2 !== 'Valjean') {
      recipes.push({ name1, name2, name3: nameEntries[i] });
    }
  }

  return recipes;
}

export function fuseWithDiffRace(name1: string, comp: Compendium, chart: SquareChart): NameTrio[] {
  const recipes: NameTrio[] = [];

  for (const nameR of comp.reverseLookupSpecial(name1)) {
    for (const rec of splitWithDiffRace(nameR, comp, chart)) {
      if (rec.name1 === name1) {
        recipes.push({ name1: nameR, name2: rec.name2, name3: rec.name3 });
      } else if (rec.name2 === name1) {
        recipes.push({ name1: nameR, name2: rec.name1, name3: rec.name3 });
      } else if (rec.name3 === name1) {
        recipes.push({ name1: nameR, name2: rec.name1, name3: rec.name2 });
      }
    }
  }

  return recipes;
}
