import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  person: string;
  conv: string;
}

export interface Skill extends BaseSkill {
  enemyOnly?: boolean;
}
