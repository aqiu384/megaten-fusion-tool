import { Demon as BaseDemon, Skill as BaseSkill, CompendiumConfig as BaseComp } from '../compendium/models';

export interface Demon extends BaseDemon {
  item: string;
  persona: string;
  trait: string;
  exp: number;
}

export interface Skill extends BaseSkill {
  transfer: { demon: string, level: number }[];
}

export interface MultiFusionPair {
  price: number;
  names1: string[];
  lvl1: number;
  names2: string[];
  lvl2: number;
}

export interface CompendiumConfig extends BaseComp {
  races: string[];
  baseStats: string[];
  skillElems: string[];
  resistElems: string[];
  resistCodes: { [code: string]: number };
  elemOrder: { [elem: string]: number };
  inheritTypes: { [elem: string]: number[] };
  inheritElems: string[];

  enemyStats: string[];
  enemyResists: string[];

  demonData: any[];
  skillData: any[];
  enemyData: any[];

  normalTable: { races: string[], table: string[][] };
  elementTable: { elems: string[], races: string[], table: number[][] };
  specialRecipes: { [name: string]: string[] };

  dlcDemons: string[];
  downloadedDemons: string[];
  settingsKey: string;
  settingsVersion: number;
}
