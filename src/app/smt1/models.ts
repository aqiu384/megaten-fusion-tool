import { Demon as BaseDemon, Skill as BaseSkill, CompendiumConfig as BaseComp } from '../compendium/models';

export interface Demon extends BaseDemon {
  atks: string[];
  inherit: string;
  drop: string;
  align: string;
}

export interface Skill extends BaseSkill {
  power: number;
  rank: number;
  target?: string;
}

export interface CompendiumConfig extends BaseComp {
  appCssClasses: string[];
  races: string[];
  resistElems: string[];
  skillElems: string[];
  baseStats: string[];
  baseAtks: string[];

  species: { [spec: string]: string[] };
  speciesLookup: { [race: string]: string };
  resistCodes: { [code: string]: number };
  elemOrder: { [elem: string]: number };
  useSpeciesFusion: boolean;

  demonData;
  skillData;
  alignData;
  normalTable;
  darkTable?;
  elementTable;
  mitamaTable?;
  tripleTable;
  tripleDarkTable?;
  tripleElementTable?;
  tripleMitamaTable?;
  specialRecipes?;
  darknessRecipes?;
}
