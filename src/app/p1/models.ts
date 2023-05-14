import { Demon as BaseDemon, Skill as BaseSkill, CompendiumConfig as BaseCompendiumConfig } from '../compendium/models';

export interface Demon extends BaseDemon {
  atks: number[],
  presists: number[],
  mresists: number[],
  party: number[],
  growth: string,
  trait: string;
  area: string;
  transfers: { [skill: string]: number; };
}

export interface Skill extends BaseSkill {
  card:  string;
}

export interface CompendiumConfig extends BaseCompendiumConfig {
  appCssClasses: string[];
  races: string[];
  resistElems: string[];
  presistElems: string[];
  mresistElems: string[];
  skillElems: string[];
  inheritElems: string[];
  baseStats: string[];
  baseAtks: string[];
  enemyStats: string[];
  party: string[];

  demons: { [name: string]: Demon };
  enemies: { [name: string]: Demon };
  skills: { [name: string]: Skill };
  fusionPrereqs: { [name: string]: string };
  specialRecipes: { [name: string]: string[] };
  growthTypes: { [name: string]: number[][] };

  resistCodes: { [code: string]: number };
  elemOrder: { [elem: string]: number };
}
