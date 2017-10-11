import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  align: string;
  inherits: string[];
  ailments?: number[];
  skills: string[];
  source: string[];
  password: string[];
}

export interface Skill extends BaseSkill {
  power: number;
  accuracy: number;
  inherit: string;
  rank: number;
  learnedBy: { demon: string, level: number }[];
  dsource: string[];
}
