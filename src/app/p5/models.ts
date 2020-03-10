import { Demon as BaseDemon, Skill as BaseSkill, CompendiumConfig as BaseComp } from '../compendium/models';

export interface Demon extends BaseDemon {
  item: string;
}

export interface Enemy extends BaseDemon {
  persona: string;
  trait: string;
  exp: number;
}

export interface Skill extends BaseSkill {
  transfer: { demon: string, level: number }[];
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

  normalTable;
  elementTable;
  specialRecipes;

  dlcDemons: string[];
  downloadedDemons: string[];
  settingsKey: string;
  settingsVersion: number;
}
