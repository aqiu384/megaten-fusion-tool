import { Demon as BaseDemon, Skill as BaseSkill, FusionEntry } from '../compendium/models';

export interface Demon extends BaseDemon {
  ailments?: string[];
  evolvesTo?: FusionEntry;
  evolvesFrom?: FusionEntry;
}

export interface Skill extends BaseSkill {
  damage?: string;
  target?: string;
}
