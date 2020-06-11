import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  ai: string;
  baseSkills: { skill: string, source: number }[];
}

export interface Skill extends BaseSkill {
  power: number;
  rank: number;
  target?: string;
  transfer: { demon: string, level: number }[];
  upgrade: string;
}
