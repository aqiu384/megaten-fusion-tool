import { NamePair, MultiFusionPair, Compendium, FusionChart } from '../models';

export function splitWithSameRace(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const { race: targetRace, lvl: targetLvl } = compendium.getDemon(name);
  const recipes: NamePair[] = [];

  if (compendium.getSpecialNameEntries(name).length) {
    return recipes;
  }

  const resultLvls = compendium.getResultDemonLvls(targetRace);
  const targetLvlIndex = resultLvls.indexOf(targetLvl);

  if (targetLvlIndex < 0) {
    return recipes;
  }

  const lvlModifier = 1;
  const minResultLvl = 2 * (targetLvl - lvlModifier);
  const maxResultLvl = resultLvls[targetLvlIndex + 1] ? 2 * (resultLvls[targetLvlIndex + 1] - lvlModifier) : 200;
  const nextResultLvl = resultLvls[targetLvlIndex + 2] ? 2 * (resultLvls[targetLvlIndex + 2] - lvlModifier) : 200;

  const ingLvls = compendium.getIngredientDemonLvls(targetRace).filter(lvl => lvl !== targetLvl);
  const ingLvlM = maxResultLvl / 2 + lvlModifier;

  for (const ingLvl2 of ingLvls) {
    if (ingLvlM < ingLvl2 && ingLvlM + ingLvl2 < nextResultLvl) {
      recipes.push({
        name1: compendium.reverseLookupDemon(targetRace, ingLvlM),
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

export function splitWithGem(name: string, compendium: Compendium, fusionChart: FusionChart): MultiFusionPair[] {
  const recipes: MultiFusionPair[] = [];

  const { race: raceR, lvl: lvlR } = compendium.getDemon(name);
  const elookup = fusionChart.getElemModifiers(raceR);

  const rlvls = compendium.getResultDemonLvls(raceR);
  const li = rlvls.indexOf(lvlR);
  const elementOffsets = Object.keys(elookup).map(x => parseInt(x, 10));
  elementOffsets.sort();

  if (li === -1) { return recipes; }

  for (const offset of elementOffsets) {
    if (0 <= li + offset && li + offset < rlvls.length) {
      const lvl1 = rlvls[li + offset];
      recipes.push({
        price: lvl1,
        names1: [compendium.reverseLookupDemon(raceR, lvl1)],
        lvl1,
        names2: elookup[offset],
        lvl2: lvl1
      })
    }
  }

  return recipes;
}

export function splitWithTreasure(name: string, compendium: Compendium, fusionChart: FusionChart): MultiFusionPair[] {
  const recipes: MultiFusionPair[] = [];

  const { race: raceR, lvl: lvlR } = compendium.getDemon(name);
  const elookup = fusionChart.getElemModifiers(raceR);

  const rlvls = compendium.getResultDemonLvls(raceR).concat([99]);
  const li = rlvls.indexOf(lvlR);
  const nextRanks = [lvlR];

  if (li === -1) { return recipes; }

  if (li > 1 && elookup[2]) {
    recipes.push({ price: 0, names1: [], lvl1: rlvls[li - 2], names2: elookup[2], lvl2: rlvls[li - 1] - 1 });
  } if (li > 0 && elookup[1]) {
    recipes.push({ price: 0, names1: [], lvl1: rlvls[li - 1], names2: elookup[1], lvl2: lvlR - 1 });
  } if (elookup[-1]) {
    recipes.push({ price: 0, names1: [], lvl1: lvlR + 1, names2: elookup[-1], lvl2: rlvls[li + 1] });
  } if (li < rlvls.length - 2 && elookup[-1]) {
    nextRanks.push(rlvls[li + 1])
    recipes.push({ price: 0, names1: [compendium.reverseLookupDemon(raceR, rlvls[li + 1])], lvl1: rlvls[li + 1], names2: elookup[-1], lvl2: rlvls[li + 2] });
  } if (li < rlvls.length - 2 && elookup[-2]) {
    recipes.push({ price: 0, names2: elookup[-2], lvl1: rlvls[li + 1] + 1, lvl2: rlvls[li + 2], names1: [] });
  } if (li < rlvls.length - 3 && elookup[-2]) {
    nextRanks.push(rlvls[li + 2]);
    recipes.push({ price: 0, names1: [compendium.reverseLookupDemon(raceR, rlvls[li + 2])], lvl1: rlvls[li + 2], names2: elookup[-2], lvl2: rlvls[li + 3] });
    recipes.push({ price: 0, names1: [compendium.reverseLookupDemon(raceR, rlvls[li + 1])], lvl1: rlvls[li + 2] + 1, names2: elookup[-2], lvl2: rlvls[li + 3] });
  }

  for (const row of recipes.filter(r => r.names1.length === 0)) {
    for (const lvl1 of compendium.getIngredientDemonLvls(raceR).filter(i => !nextRanks.includes(i))) {
      if (lvl1 <= row.lvl2) {
        row.names1.push(compendium.reverseLookupDemon(raceR, lvl1))
      }
    }
  }

  for (const row of recipes) {
    row.price = Math.pow(row.lvl1 * 3 + 7, 2) + 2000;
  }

  return recipes.filter(r => r.names1.length > 0);
}
