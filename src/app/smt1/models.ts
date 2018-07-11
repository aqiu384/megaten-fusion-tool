import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  inherit: string;
  drop: string;
}

export interface Skill extends BaseSkill {
  power: number;
  rank: number;
  target?: string;
}
