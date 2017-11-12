import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  skills: { [skill: string]: number; };
  person: string;
  confine: boolean;
}

export interface Skill extends BaseSkill {
  target: string;
  learnedBy: { demon: string, level: number }[];
}
