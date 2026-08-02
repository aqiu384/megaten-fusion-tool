import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  eresists: number[];
  combos: string[];
  area: string;
}

export interface Skill extends BaseSkill {
  transfer: { demon: string, level: number }[];
}

export interface MultiFusionTrio {
  lvl0: number;
  price: number;
  names1: string[];
  lvl1: number;
  names2: string[];
  lvl2: number;
  names3: string[];
  lvl3: number;
}

export interface CompendiumConfig {
  appTitle: string;
  raceOrder: { [race: string]: number };
  elemOrder: { [elem: string]: number };

  appCssClasses: string[];
  races: string[];
  baseStats: string[];
  skillElems: string[];
  resistElems: string[];
  affinityElems: string[];
  resistCodes: { [code: string]: number };

  demonData: any[];
  skillData: any[];
  specialRecipes: { [result: string]: string[] };
  pairRecipes: { [result: string]: string[] };
  downRecipes: { [result: string]: string[] };
}
