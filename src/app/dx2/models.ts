import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  ai: string;
  mstats: number[];
  learned: { [skill: string]: number; };
  gacha: { [skill: string]: number; };
  reikos: { [reiko: string]: number; };
}

export interface Skill extends BaseSkill {
  power: number;
  rank: number;
  target?: string;
  transfer: { demon: string, level: number }[];
}
