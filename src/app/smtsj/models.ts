import { Demon as BaseDemon, Skill as BaseSkill } from '../compendium/models';

export interface Demon extends BaseDemon {
  attack: string;
  code: number;
  pcoeff: number;
  hpmod: number;
  align: string;
  ailments?: number[];
  source: { [skill: string]: number; };
}

export interface Skill extends BaseSkill {
  code: number;
  power: number;
  accuracy: number;
  inherit: string;
  transfer: { demon: string, level: number }[];
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
