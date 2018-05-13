import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  item: string;
}

export interface Enemy extends BaseDemon {
  persona: string;
  trait: string;
  exp: number;
}

export interface Skill extends BaseSkill {
  talk: string;
  fuse: string;
}
