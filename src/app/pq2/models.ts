import { DemonUnlock } from '../compendium/models/fusion-settings';
import {
  Demon as BaseDemon, Skill as BaseSkill, CompendiumConfig as BaseComp,
  FusionTableData, ElementTableData
} from '../compendium/models';

export interface Demon extends BaseDemon {
  ailments: number[];
  code: number;
}

export interface Skill extends BaseSkill {
  target: string;
  code: number;
  transfer: { demon: string, level: number }[];
}

export interface DecodedDemon {
  language: string;
  demonCode: number;
  lvl: number;
  exp: number;
  hp: number;
  mp: number;
  skillCodes: number[];
}

export interface CompendiumConfig extends BaseComp {
  appCssClasses: string[];
  translations: { [en: string]: string[] };
  lang: string;
  races: string[];

  skillData: any[];
  skillElems: string[];
  ailmentElems: string[];
  elemOrder: { [elem: string]: number };
  resistCodes: { [code: string]: number };
  inheritTypes: { [elem: string]: number[] };
  inheritElems: string[];

  demonData: any[];
  baseStats: string[];
  resistElems: string[];

  enemyData: any[];
  enemyStats: string[];

  demonUnlocks: DemonUnlock[];
  normalTable: FusionTableData;
  elementTable: ElementTableData;
  specialRecipes: { [demon: string]: string[] };
  hasTripleFusion: boolean;
  hasDemonResists: boolean;
  hasSkillRanks: boolean;
  hasEnemies: boolean;
  hasQrcodes: boolean;
  hasSkillCards: boolean;
  hasManualInheritance: boolean;

  defaultDemon: string;
  settingsKey: string;
  settingsVersion: number;
}

export interface CompendiumConfigSet extends BaseComp {
  configs: { [game: string]: CompendiumConfig };
}
