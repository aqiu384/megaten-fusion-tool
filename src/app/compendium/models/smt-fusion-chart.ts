import {
  FusionChart,
  FissionChart,
  FuusionChart,
  ElementChart,
  RaceCombos,
  ElemCombos,
  ElemModifiers
} from '../models';

export abstract class SmtFusionChart implements FusionChart {
  protected abstract fissionChart: FissionChart;
  protected abstract fusionChart: FuusionChart;
  protected abstract elementChart: ElementChart;

  abstract lvlModifier: number;
  abstract elementDemons: string[];

  static loadFissionChart(races: string[], elems: string[], fusionJson: any): FissionChart {
    const chart: FissionChart = {};

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

  static loadFusionChart(races: string[], fusionJson: any): FuusionChart {
    const chart: FuusionChart = {};

    for (const race of races) {
      chart[race] = {};
    }

    for (const [raceA, raceBs] of Object.entries(fusionJson)) {
      for (const [raceB, raceR] of Object.entries(raceBs)) {
        if (raceA !== raceB) {
          chart[raceA][raceB] = raceR;
          chart[raceB][raceA] = raceR;
        }
      }
    }

    return chart;
  }

  getRaceFissions(race: string): RaceCombos {
    return this.fissionChart[race];
  }

  getRaceFusions(race: string): RaceCombos {
    const combos: RaceCombos = {};

    for (const [raceB, raceR] of Object.entries(this.fusionChart[race])) {
      if (!combos[raceR]) {
        combos[raceR] = [];
      }

      combos[raceR].push(raceB);
    }

    return combos;
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

  getElemFusions(elem: string): ElemCombos {
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
