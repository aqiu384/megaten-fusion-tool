import { Demon as BaseDemon, Skill as BaseSkill, CompendiumConfig as BaseComp } from '../compendium/models';

export interface Demon extends BaseDemon {
  card?: string;
  cardLvl: number;
}

export interface Skill extends BaseSkill {
  transfer: { demon: string, level: number }[];
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

  normalTable: { [game: string]: any };
  specialRecipes: { [game: string]: any };
  hasSkillCards: { [game: string]: boolean };
}
