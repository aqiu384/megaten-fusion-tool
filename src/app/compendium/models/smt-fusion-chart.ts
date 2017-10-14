import {
  FusionChart,
  FissionTable,
  FusionTable,
  ElementTable,
  FissionRow,
  FusionRow,
  ElementRow,
  ElemModifiers
} from '../models';

export abstract class SmtFusionChart implements FusionChart {
  protected abstract fissionChart: FissionTable;
  protected abstract fusionChart: FusionTable;
  protected abstract elementChart: ElementTable;

  abstract lvlModifier: number;
  abstract elementDemons: string[];

  static loadFissionChart(races: string[], elems: string[], fusionJson: any): FissionTable {
    const chart: FissionTable = {};

    for (const race of races) {
      chart[race] = {};
    }

    for (const elem of elems) {
      chart[elem] = {};
    }

    for (const [raceA, raceBs] of Object.entries(fusionJson)) {
      for (const [raceB, raceR] of Object.entries(raceBs)) {
        if (!chart[raceR][raceA]) {
          chart[raceR][raceA] = [];
        }

        chart[raceR][raceA].push(raceB);
      }
    }

    return chart;
  }

  static loadFusionChart(races: string[], fusionJson: any): FusionTable {
    const chart: FusionTable = {};

    for (const race of races) {
      chart[race] = {};
    }

    for (const [raceA, raceBs] of Object.entries(fusionJson)) {
      for (const [raceB, raceR] of Object.entries(raceBs)) {
        chart[raceA][raceB] = raceR;
        chart[raceB][raceA] = raceR;
      }
    }

    return chart;
  }

  getRaceFissions(race: string): FissionRow {
    return this.fissionChart[race] || {};
  }

  getRaceFusions(race: string): FusionRow {
    return this.fusionChart[race] || {};
  }

  getRaceFusion(raceA: string, raceB: string): string {
    return this.fusionChart[raceA][raceB];
  }

  getElemModifiers(race: string): ElemModifiers {
    const modifiers: ElemModifiers = {};

    for (const [elem, mod] of Object.entries(this.elementChart[race])) {
      if (!modifiers[mod]) {
        modifiers[mod] = [];
      }

      modifiers[mod].push(elem);
    }

    return modifiers;
  }

  getElemFusions(elem: string): ElementRow {
    const combos = {};

    for (const [race, row] of Object.entries(this.elementChart)) {
      if (row[elem]) {
        combos[race] = row[elem];
      }
    }

    return combos;
  }

  isConvertedRace(race: string): boolean {
    return false;
  }
}
