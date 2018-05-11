import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  sacrifice?: string;
}

export interface Enemy extends BaseDemon {
  ailments: string[];
  exp: number;
}

export interface Skill extends BaseSkill {
  target: string;
  fuse: string;
}
