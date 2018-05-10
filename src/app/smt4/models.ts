import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  ailments?: string[];
}

export interface Skill extends BaseSkill {
  damage?: string;
  target?: string;
}
