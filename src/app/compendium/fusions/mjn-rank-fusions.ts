import { NamePair, Compendium, FusionChart } from '../models';

const RACE_MODS = {
  Deity: 2,
  Dragon: 1,
  Snake: 1,
  Divine: 1,
  Kishin: 1
}

export function splitMajinByRank(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const recipes: NamePair[] = [];
  const { race: raceR, lvl: lvlR } = compendium.getDemon(name);
  const lvlRs = compendium.getResultDemonLvls(raceR);
  const indR = lvlRs.indexOf(lvlR);

  if (indR === -1) {
    return [];
  }

  for (const [raceA, raceBs] of Object.entries(fusionChart.getRaceFissions(raceR))) {
    const modA = RACE_MODS[raceA] || 0;
    const lvlAs = compendium.getIngredientDemonLvls(raceA);

    for (let indA = 0; indA < lvlAs.length; indA++) {
      for (const raceB of raceBs) {
        const modB = RACE_MODS[raceB] || 0;
        const lvlBs = compendium.getIngredientDemonLvls(raceB);

        for (let indB = 0; indB < lvlBs.length; indB++) {
          if (Math.floor(indA / 2 + indB / 2) == indR) {
            const indR = Math.floor((indA + modA + indB + modB) / 2);
            recipes.push({
              name1: compendium.reverseLookupDemon(raceA, lvlAs[indA]),
              name2: compendium.reverseLookupDemon(raceB, lvlBs[indB])
            });
          }
        }
      }
    }
  }

  return recipes;
}

export function fuseMajinByRank(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const recipes: NamePair[] = [];
  const { race: raceA, lvl: lvlA } = compendium.getDemon(name);
  const modA = RACE_MODS[raceA] || 0;
  const lvlAs = compendium.getIngredientDemonLvls(raceA);
  const indA = lvlAs.indexOf(lvlA);

  if (indA === -1) {
    return [];
  }

  for (const [raceB, raceR] of Object.entries(fusionChart.getRaceFusions(raceA))) {
    const lvlsR = compendium.getResultDemonLvls(raceR);
    const modB = RACE_MODS[raceB] || 0;
    const lvlBs = compendium.getIngredientDemonLvls(raceB);

    for (let indB = 0; indB < lvlBs.length; indB++) {
      const indR = Math.floor((indA + modA + indB + modB) / 2);
      if (indR < lvlsR.length) {
        recipes.push({
          name1: compendium.reverseLookupDemon(raceB, lvlBs[indB]),
          name2: compendium.reverseLookupDemon(raceR, lvlsR[indR])
        });
      }
    }
  }

  return recipes;
}
