import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  inherits: string;
  skills: { [skill: string]: number; };
}

export interface Skill extends BaseSkill {
  learnedBy: { demon: string, level: number }[];
  talk: string;
  fuse: string;
}
