import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  skills: { [skill: string]: number; };
  person: string;
  conv: string;
}

export interface Skill extends BaseSkill {
  learnedBy: { demon: string, level: number }[];
}
