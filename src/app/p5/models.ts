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
  talk: string;
  fuse: string;
}

export interface CompendiumConfig extends BaseComp {
  gameTitles: { [game: string]: string };
  appCssClasses: string[];

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

  demonData: { [game: string]: any[] };
  skillData: { [game: string]: any[] };
  enemyData: { [game: string]: any[] };
  traitData: { [trait: string]: any };

  normalTable: { [game: string]: any };
  elementTable: { [game: string]: any };
  specialRecipes: { [game: string]: any };
  hasSkillCards: { [game: string]: boolean };

  dlcDemons: { [game: string]: string[] };
  settingsKey: { [game: string]: string };
  settingsVersion: number;
}
