import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  person: string;
  confine: boolean;
}

export interface Skill extends BaseSkill {
  target: string;
}
