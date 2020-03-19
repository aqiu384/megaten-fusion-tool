import { Demon as BaseDemon, Skill as BaseSkill, CompendiumConfig as BaseComp, FusionCalculator } from '../compendium/models';

export interface Demon extends BaseDemon {
  person: string;
}

export interface Skill extends BaseSkill {
  target: string;
}

export interface CompendiumConfig extends BaseComp {
  gameTitles: { [game: string]: string };
  appCssClasses: string[];

  races: string[];
  resistElems: string[];
  skillElems: string[];
  baseStats: string[];
  fusionLvlMod: number;

  resistCodes: { [code: string]: number };
  elemOrder: { [elem: string]: number };
  fissionCalculator: FusionCalculator;
  fusionCalculator: FusionCalculator;

  demonData: { [game: string]: any[] };
  skillData: { [game: string]: any[] };
  normalTable: { races: string[]; table: string[][]; };
  elementTable: { elems: string[]; races: string[]; table: number[][] };
  mitamaTable: string[][];
  specialRecipes: { [game: string]: any };
}