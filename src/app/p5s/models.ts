import { Demon as BaseDemon, Skill as BaseSkill, CompendiumConfig as BaseComp } from '../compendium/models';

export interface Demon extends BaseDemon {
  card?: string;
}

export interface Skill extends BaseSkill {
  transfer: { demon: string, level: number }[];
}

export interface CompendiumConfig extends BaseComp {
  appCssClasses: string[];

  races: string[];
  baseStats: string[];
  skillElems: string[];
  resistElems: string[];
  resistCodes: { [code: string]: number };
  elemOrder: { [elem: string]: number };
  inheritTypes: { [elem: string]: number[] };
  inheritElems: string[];

  demonData: any[];
  skillData: any[];
  normalTable: any;
  specialRecipes: { [result: string]: string[] };
  pairRecipes: { [result: string]: string[] };
}
