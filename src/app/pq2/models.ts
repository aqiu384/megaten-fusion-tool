import { Demon as BaseDemon, Skill as BaseSkill, CompendiumConfig as BaseComp } from '../compendium/models';

export interface Demon extends BaseDemon {
  code: number;
}

export interface Skill extends BaseSkill {
  target: string;
  fuse: string[];
  code: number;
}

export interface DecodedDemon {
  demonCode: number;
  lvl: number;
  exp: number;
  hp: number;
  mp: number;
  skillCodes: number[];
}

export interface CompendiumConfig extends BaseComp {
  appCssClasses: string[];
  races: string[];

  skillData;
  skillElems: string[];
  elemOrder: { [elem: string]: number };
  resistCodes: { [code: string]: number };

  demonData;
  dlcData?;
  baseStats: string[];
  resistElems: string[];

  enemyData;
  enemyStats: string[];
  enemyResists: string[];

  normalTable;
  hasTripleFusion: boolean;
  specialRecipes?;

  settingsKey: string;
  settingsVersion: number;
}