import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  card?: string;
}

export interface Skill extends BaseSkill {
  fuse: string;
}
