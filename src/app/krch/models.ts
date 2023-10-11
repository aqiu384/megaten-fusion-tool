import { Demon as BaseDemon, Skill as BaseSkill, CompendiumConfig as BaseComp, FusionCalculator } from '../compendium/models';

export interface Demon extends BaseDemon {
  person: string;
}

export interface Skill extends BaseSkill {
  target: string;
}

export interface CompendiumConfig extends BaseComp {
  appCssClasses: string[];

  races: string[];
  resistElems: string[];
  skillElems: string[];
  baseStats: string[];
  fusionLvlMod: number;

  resistCodes: { [code: string]: number };
  elemOrder: { [elem: string]: number };
  fissionCalculator: FusionCalculator;
  fusionCalculator: FusionCalculator;

  demonData: any[];
  skillData: any[];
  normalTable: { races: string[]; table: string[][]; };
  elementTable: { elems: string[]; races: string[]; table: number[][] };
  mitamaTable: string[][];
  specialRecipes: any;
  isDesu: boolean;
}

export interface CompendiumConfigSet extends BaseComp {
  configs: { [game: string]: CompendiumConfig };
}
