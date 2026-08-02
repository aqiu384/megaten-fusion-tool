import { DemonUnlock } from '../compendium/models/fusion-settings';
import {
  Demon as BaseDemon, Skill as BaseSkill,
  FusionTableData, ElementTableData
} from '../compendium/models';

export interface Demon extends BaseDemon {
  growths: number[];
  ailments: number[];
  code: number;
  dropOdds: { [drop: string]: number };
}

export interface Skill extends BaseSkill {
  target: string;
  code: number;
  transfer: { demon: string, level: number }[];
}

export interface DecodedDemon {
  isEnglish: boolean;
  demonCode: number;
  lvl: number;
  exp: number;
  hp: number;
  mp: number;
  skillCodes: number[];
}

export interface CompendiumConfig {
  appTitle: string;
  raceOrder: { [race: string]: number };
  elemOrder: { [elem: string]: number };

  appCssClasses: string[];
  lang: string;
  races: string[];

  skillData: any[];
  skillElems: string[];
  ailmentElems: string[];
  resistCodes: { [code: string]: number };
  inheritTypes: { [elem: string]: number[] };
  inheritElems: string[];

  demonData: any[];
  baseStats: string[];
  resistElems: string[];

  enemyData: any[];
  enemyStats: string[];
  enemyGrowths: string[];

  demonUnlocks: DemonUnlock[];
  normalTable: FusionTableData;
  elementTable: ElementTableData;
  specialRecipes: { [demon: string]: string[] };
  maxSkillSlots: number;
  hasTripleFusion: boolean;
  hasDemonResists: boolean;
  hasSkillRanks: boolean;
  hasEnemies: boolean;
  hasQrcodes: boolean;
  hasSkillCards: boolean;
  hasManualInheritance: boolean;
  computePrice(base: Demon, decoded: DecodedDemon): number;

  defaultDemon: string;
  settingsKey: string;
  settingsVersion: number;
}

export interface CompendiumConfigSet {
  [game: string]: CompendiumConfig;
}
