export interface Demon {
  name: string;
  race: string;
  lvl: number;
  price: number;
  inherits: boolean[];
  stats: number[];
  resists: number[];
  skills: { [skill: string]: number; };
  fusion: string;
}

export interface Skill {
  name: string;
  element: string;
  cost: number;
  rank: number;
  effect: string;
  learnedBy: { demon: string, level: number }[];
  fuse: string;
  level: number;
}
