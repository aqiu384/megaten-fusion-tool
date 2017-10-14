import { Observable } from 'rxjs/Observable';

export interface CompendiumConfig {
  appTitle: string;
  raceOrder: { [race: string]: number };
}

export interface FusionTableHeaders {
  left: string;
  right: string;
}

export interface Demon {
  race: string;
  lvl: number;
  name: string;
  inherit?: string;
  inherits?: string[];
  stats: number[];
  resists: string[];
  fusion: string;
  prereq?: string;
  affinities?: number[];
}

export interface Skill {
  element: string;
  rank: number;
  name: string;
  cost: number;
  effect: string;
  level: number;
  requires?: string;
  inherit?: string;
}

export interface Compendium {
  dlcDemons: { [name: string]: boolean };
  allDemons: Demon[];
  allSkills: Skill[];
  specialDemons: Demon[];

  getDemon(name: string): Demon;
  getSkill(name: string): Skill;
  getIngredientDemonLvls(race: string): number[];
  getResultDemonLvls(race: string): number[];
  getSpecialNameEntries(name: string): string[];
  getSpecialNamePairs(name: string): NamePair[];

  reverseLookupSpecial(ingredient: string): { result: string, recipe: string }[];
  reverseLookupDemon(race: string, lvl: number): string;
  isElementDemon(name: string): boolean;
}

export interface FusionDataService {
  fissionCalculator: FusionCalculator;
  fusionCalculator: FusionCalculator;
  compendium: Observable<Compendium>;
  fusionChart: Observable<FusionChart>;
  nextDlcDemons(dlcDemons: { [name: string]: boolean });
}

export type FusionCalculation = (
  demon: string,
  compendium: Compendium,
  fusionChart: FusionChart
) => NamePair[];

export interface FusionCalculator {
  getFusions(demon: string, compendium: Compendium, fusionChart: FusionChart): NamePair[];
}

export interface NamePair {
  name1: string;
  name2: string;
}

export interface FusionEntry {
  race1: string;
  lvl1: number;
  name1: string;
}

export interface FusionPair extends FusionEntry {
  race2: string;
  lvl2: number;
  name2: string;
  notes?: string;
}

export interface FissionTable { [race: string]: FissionRow; }
export interface FusionTable  { [race: string]: FusionRow; }
export interface ElementTable { [race: string]: ElementRow; }

export interface FissionRow    { [race: string]: string[]; }
export interface FusionRow     { [race: string]: string; }
export interface ElementRow    { [race: string]: number; }
export interface ElemModifiers { [modifier: number]: string[]; }

export interface FusionChart {
  lvlModifier: number;
  elementDemons: string[];

  getRaceFissions(race: string): FissionRow;
  getRaceFusions(race: string): FusionRow;
  getElemModifiers(race: string): ElemModifiers;
  getElemFusions(elem: string): ElementRow;
  isConvertedRace(race: string): boolean;
}

export interface TriangleFusionChart extends FusionChart {
  getTriangleFissions(race: string): FissionRow;
  getTriangleFusions(race: string): FusionRow;
}
