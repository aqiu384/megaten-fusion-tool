import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  affinities: number[];
  ailments?: string[];
  skills: { [skill: string]: number; };
}

export interface Skill extends BaseSkill {
  rank: number;
  learnedBy: { demon: string, level: number }[];
}
