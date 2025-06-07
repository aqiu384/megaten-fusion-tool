import {
  Demon as BaseDemon, Skill as BaseSkill, CompendiumConfig as BaseComp,
  FusionEntry, FusionTableData, ElementTableData
} from '../compendium/models';
import { DemonUnlock } from '../compendium/models/fusion-settings';

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
  translations: { [en: string]: string[] };
  lang: string;
  races: string[];

  skillData: any[];
  fusionSpells: { [spell: string]: string[] };
  ailmentElems: string[];
  affinityElems: string[];
  skillElems: string[];
  elemOrder: { [elem: string]: number };
  resistCodes: { [code: string]: number };
  alignments: { [align: string]: string };

  affinityBonuses: { costs: number[][], upgrades: number[][] };
  lvlModifier: number;
  maxSkillSlots: number;
  hasLightDark: boolean;

  demonData: any[];
  evolveData;
  baseStats: string[];
  resistElems: string[];

  demonUnlocks: DemonUnlock[];
  normalTable: FusionTableData;
  elementTable: ElementTableData;
  specialRecipes: { [demon: string]: string[] };

  settingsKey: string;
  settingsVersion: number;
  defaultRecipeDemon: string;
  elementRace: string;
}

export interface CompendiumConfigSet extends BaseComp {
  configs: { [game: string]: CompendiumConfig };
}
