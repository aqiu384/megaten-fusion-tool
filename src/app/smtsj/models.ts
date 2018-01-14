import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  code: number;
  pcoeff: number;
  hpmod: number;
  align: string;
  inherits: boolean[];
  ailments?: string[];
  skills: { [skill: string]: number; };
  source: { [skill: string]: number; };
}

export interface Skill extends BaseSkill {
  code: number;
  power: number;
  accuracy: number;
  inherit: string;
  rank: number;
  learnedBy: { demon: string, level: number }[];
  dsource: string[];
}

export interface DecodedDemon {
  demonCode: number;
  lvl: number;
  exp: number;
  stats: number[];
  baseStats: number[];
  skillCodes: number[];
  maskByte: number;
}
