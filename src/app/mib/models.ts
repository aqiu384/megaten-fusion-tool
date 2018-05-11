import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  type: string;
  subtype: string;
  drops: string;
  growth: string;
  affinity: string;
  presists: number[];
  mresists: number[];
  atks: number[];
}

export interface Enemy extends BaseDemon {
  type: string;
  subtype: string;
  traits: string[];
  atks: number[];
  contacts: { actor: string, action: string, result: string }[];
  presists: number[];
  mresists: number[];
  transfers: { [skill: string]: number; };
  area: string;
  drop: string;
}

export interface Skill extends BaseSkill {
  power: number;
  range: number;
  target: number;
  transfer: { demon: string, level: number }[];
}
