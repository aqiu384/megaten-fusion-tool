import { Demon as BaseDemon, Skill as BaseSkill, CompendiumConfig as BaseComp } from '../compendium/models';

export interface Demon extends BaseDemon {
  atks: number[];
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

  resistCodes: { [code: string]: number };
  elemOrder: { [elem: string]: number };
  inheritSkills?: { [code: number]: { [skill: string]: number } };

  demonData;
  skillData;
  alignData;
  normalTable;
  specialRecipes?;
}
