import { Skill as BaseSkill, CompendiumConfig as BaseComp } from '../compendium/models';

export interface Skill extends BaseSkill {
  target: string;
  fuse: string[];
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