import { Compendium, FusionEntry, NamePair, FusionPair, NameTrio, DemonTrio } from '../models';

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

export function toDemonTrio(names: NameTrio, compendium: Compendium): DemonTrio {
  return {
    d1: compendium.getDemon(names.name1),
    d2: compendium.getDemon(names.name2),
    d3: compendium.getDemon(names.name3)
  };
}
