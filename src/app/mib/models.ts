import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  type: string;
  subtype: string;
  drop: string;
  atks: number[];
  presists: number[];
  mresists: number[];

  growth: string;
  affinity: string;

  traits: string[];
  contacts: { actor: string, action: string, result: string }[];
  transfers: { [skill: string]: number; };
  area: string;
}

export interface Skill extends BaseSkill {
  power: number;
  range: number;
}
