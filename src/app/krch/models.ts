import {
  Demon as BaseDemon, Skill as BaseSkill, CompendiumConfig as BaseComp,
  FusionCalculator, NormalFusionTable, ElementFusionTable
} from '../compendium/models';

export interface Demon extends BaseDemon {
  person: string;
}

export interface Skill extends BaseSkill {
  target: string;
}

export interface CompendiumConfig extends BaseComp {
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

  demonData: any[];
  skillData: any[];
  normalTable: NormalFusionTable;
  elementTable: ElementFusionTable;
  specialRecipes: { [demon: string]: string[] };
  isDesu: boolean;
}

export interface CompendiumConfigSet extends BaseComp {
  configs: { [game: string]: CompendiumConfig };
}
