import { Demon as BaseDemon, Skill as BaseSkill, CompendiumConfig as BaseComp } from '../compendium/models';
import { DemonUnlock } from '../compendium/models/fusion-settings';

export interface Demon extends BaseDemon {
  item: string;
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
  affinityElems: string[];
  resistCodes: { [code: string]: number };
  elemOrder: { [elem: string]: number };

  enemyStats: string[];
  enemyResists: string[];

  demonData: any[];
  skillData: any[];
  enemyData: any[];

  normalTable: { races: string[], table: string[][] };
  elementTable: { elems: string[], races: string[], table: number[][] };
  specialRecipes: { [name: string]: string[] };
  demonUnlocks: DemonUnlock[];

  dlcDemons: string[];
  downloadedDemons: string[];
  settingsKey: string;
  settingsVersion: number;
}
