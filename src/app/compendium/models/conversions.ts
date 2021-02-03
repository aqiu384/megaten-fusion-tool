import { Compendium, FusionEntry, NamePair, FusionPair, NameTrio, DemonTrio } from '../models';

export function toFusionEntry(name: string, compendium: Compendium): FusionEntry {
  const demon = compendium.getDemon(name);

  return {
    price: demon.price,
    race1: demon.race,
    lvl1: demon.currLvl,
    name1: name
  };
}

export function toFusionPair(names: NamePair, compendium: Compendium): FusionPair {
  const demon1 = compendium.getDemon(names.name1);
  const demon2 = compendium.getDemon(names.name2);

  return {
    price: demon1.price + demon2.price,
    race1: demon1.race,
    lvl1: demon1.currLvl,
    name1: names.name1,
    race2: demon2.race,
    lvl2: demon2.currLvl,
    name2: names.name2
  };
}

export function toFusionPairResult(names: NamePair, compendium: Compendium): FusionPair {
  const demon1 = compendium.getDemon(names.name1);
  const demon2 = compendium.getDemon(names.name2);

  return {
    price: demon1.price,
    race1: demon1.race,
    lvl1: demon1.currLvl,
    name1: names.name1,
    race2: demon2.race,
    lvl2: demon2.lvl,
    name2: names.name2
  };
}

export function toDemonTrio(names: NameTrio, compendium: Compendium): DemonTrio {
  const d1 = compendium.getDemon(names.name1);
  const d2 = compendium.getDemon(names.name2);
  const d3 = compendium.getDemon(names.name3);

  return {
    price: d1.price + d2.price + d3.price,
    d1, d2, d3
  };
}

export function toDemonTrioResult(names: NameTrio, compendium: Compendium): DemonTrio {
  const d1 = compendium.getDemon(names.name1);
  const d2 = compendium.getDemon(names.name2);
  const d3 = compendium.getDemon(names.name3);

  return {
    price: d1.price + d2.price,
    d1, d2, d3
  };
}
