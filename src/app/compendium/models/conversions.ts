import { Compendium, FusionEntry, NamePair, FusionPair } from '../models';

export function toFusionEntry(name: string, compendium: Compendium): FusionEntry {
  const demon = compendium.getDemon(name);

  return {
    race1: demon.race,
    lvl1: demon.lvl,
    name1: name
  };
}

export function toFusionPair(names: NamePair, compendium: Compendium): FusionPair {
  const demon1 = compendium.getDemon(names.name1);
  const demon2 = compendium.getDemon(names.name2);

  return {
    race1: demon1.race,
    lvl1: demon1.lvl,
    name1: names.name1,
    race2: demon2.race,
    lvl2: demon2.lvl,
    name2: names.name2
  };
}
