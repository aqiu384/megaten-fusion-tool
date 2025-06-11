import { FusionChart, FissionTable, FissionRow, FusionTable, FusionRow, ElemModifiers, ElementRow } from '../../compendium/models';
import { CompendiumConfig } from '../models';

export class SpeciesFusionChart implements FusionChart {
  lvlModifier = 7.5;
  elementDemons = [];

  speciesLookup: { [race: string]: string };
  fissionChart: FissionTable;
  fusionChart: FusionTable;
  races: string[];
  raceOrder: { [race: string]: number; };

  constructor(compConfig: CompendiumConfig) {
    this.initCharts(compConfig);
  }

  initCharts(compConfig: CompendiumConfig) {
    const races: string[] = compConfig.tripleTable['races']
    const table: string[][] = compConfig.tripleTable['table'];
    const triRaces = races.map(race => '3' + race);

    this.raceOrder = compConfig.raceOrder;
    this.speciesLookup = compConfig.speciesLookup;
    this.fissionChart = {};
    this.fusionChart = {};
    this.races = races;

    for (const race of triRaces) {
      this.fusionChart[race] = {}
    }

    let r = -1;

    for (let n1 = 0; n1 < triRaces.length; n1++) {
      for (let n2 = n1 + 1; n2 < triRaces.length; n2++) {
        const raceN1 = triRaces[n1];
        const raceN2 = triRaces[n2];
        const race1 = raceN1 + '|' + raceN2;

        r += 1;

        this.fissionChart[race1] = {}
        this.fusionChart[race1] = {};

        this.fissionChart[race1][raceN1] = [raceN2];
        this.fusionChart[raceN1][raceN2] = race1;
        this.fusionChart[raceN2][raceN1] = race1;

        for (let c = 0; c < triRaces.length; c++) {
          const race2 = triRaces[c];
          const raceR = table[r][c];

          if (!this.fissionChart[raceR]) {
            this.fissionChart[raceR] = {};
          }

          this.fissionChart[raceR][race1] = [race2];
          this.fusionChart[race1][race2] = raceR;
          this.fusionChart[race2][race1] = raceR;
        }
      }
    }
  }

  getRaceFissions(race: string): FissionRow {
    return this.fissionChart[race] || {};
  }

  getRaceFusions(race: string): FusionRow {
    const species = this.speciesLookup[race];
    return species ? this.fusionChart['3' + species] || {}: this.fusionChart[race] || {};
  }

  getRaceFusion(raceA: string, raceB: string): string {
    return this.getRaceFusions(raceA)[raceB] || '';
  }

  getLightDark(race: string): number { return 0; }
  getElemModifiers(race: string): ElemModifiers { return {}; }
  getElemFusions(elem: string): ElementRow { return {}; }
  isConvertedRace(race: string): boolean { return false; }
}
