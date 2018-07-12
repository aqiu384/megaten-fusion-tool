import { Demon as BaseDemon, Skill as BaseSkill, CompendiumConfig as BaseComp } from '../compendium/models';

export interface Demon extends BaseDemon {
  inherit: string;
  drop: string;
}

export interface Skill extends BaseSkill {
  power: number;
  rank: number;
  target?: string;
}

export interface CompendiumConfig extends BaseComp {
  races: string[];
  resistElems: string[];
  skillElems: string[];
  baseStats: string[];

  species: { [spec: string]: string[] };
  speciesLookup: { [race: string]: string };
  resistCodes: { [code: string]: number };
  elemOrder: { [elem: string]: number };

  demonData;
  skillData;
  alignData;
  normalTable;
  tripleTable;
  elementTable;
}
