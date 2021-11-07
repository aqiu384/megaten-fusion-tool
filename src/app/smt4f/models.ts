import { Demon as BaseDemon, Skill as BaseSkill, FusionEntry, CompendiumConfig as BaseComp } from '../compendium/models';

export interface Demon extends BaseDemon {
  ailments?: number[];
  evolvesTo?: FusionEntry;
  evolvesFrom?: FusionEntry;
}

export interface Skill extends BaseSkill {
  damage?: string;
  target?: string;
}

export interface CompendiumConfig extends BaseComp {
  appCssClasses: string[];
  races: string[];
  engNames: { [ename: string]: string };
  lang?: string;

  skillData;
  ailmentElems: string[];
  affinityElems: string[];
  skillElems: string[];
  elemOrder: { [elem: string]: number };
  resistCodes: { [code: string]: number };

  affinityBonuses: {
    costs: number[][],
    upgrades: number[][]
  }

  demonData;
  evolveData;
  dlcDemons: string[];
  baseStats: string[];
  resistElems: string[];

  normalTable;
  elementTable;
  specialRecipes;

  settingsKey: string;
  settingsVersion: number;
}
