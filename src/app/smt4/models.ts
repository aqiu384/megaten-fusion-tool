import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  ailments?: string[];
  skills: { [skill: string]: number; };
}

export interface Skill extends BaseSkill {
  rank: number;
  damage?: string;
  target?: string;
  learnedBy: { demon: string, level: number }[];
}
