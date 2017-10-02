import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  align: string;
  affinities?: number[];
  ailments?: number[];
  skills: string[];
  source: string[];
  inherits: string[];
  password: string[];
}

export interface Skill extends BaseSkill {
  power: number;
  accuracy: number;
  inherit: string;
  rank: number;
  learnedBy: string[];
  dsource: string[];
}
