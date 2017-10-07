import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  skills: { [skill: string]: number; };
}

export interface Skill extends BaseSkill {
  rank: number;
  damage?: string;
  target?: string;
  learnedBy: { demon: string, level: number }[];
  requires?: string;
}

export interface SpecialRecipe {
  pair?: string;
  entry?: string;
  lvl?: string;
}
