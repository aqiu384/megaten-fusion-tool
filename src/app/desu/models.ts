export interface Demon {
  name: string;
  race: string;
  lvl: number;
  price: number;
  stats: number[];
  resists: number[];
  skills: { [skill: string]: number };
  command: { [skill: string]: number };
  passive: { [skill: string]: number };
  fusion: string;
  unique: boolean;
  raceup: number;
  racial?: RacialSkill;
}

export interface Skill {
  name: string;
  element: string;
  cost: number;
  rank: number;
  effect: string;
  requires: string;
  learnedBy: { demon: string, level: number }[];
  newoc?: boolean;
  level: number;
}

export interface RacialSkill {
  skill: string;
  effect: string;
  enskill?: string;
  eneffect?: string;
}
