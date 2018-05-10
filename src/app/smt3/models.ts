import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  traits?: string[];
}

export interface Skill extends BaseSkill {
  rank: number;
  damage?: string;
  target?: string;
  requires?: string;
}

export interface SpecialRecipe {
  pair?: string;
  entry?: string;
  lvl?: string;
}
