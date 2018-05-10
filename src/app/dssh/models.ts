import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  atks: number[];
  inherit: string;
  person: string;
}

export interface Skill extends BaseSkill {
  power: number;
}
