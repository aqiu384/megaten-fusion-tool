import { Races, PrimeElements } from './constants';
import { FissionTable, FusionTable, ElementTable, FissionRow, FusionRow } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';

import * as FUSION_CHART_JSON from '../data/fusion-chart.json';
import * as ELEMENT_MODIFIERS_JSON from '../data/element-modifiers.json';

export class FusionChart extends SmtFusionChart {
  private static RACE_CONVERTERS = {
    Beast: 'UMA',
    Genma: 'Fiend',
    Deity: 'Enigma'
  };

  private static INVERSE_RACE_CONVERTERS = {
    UMA: 'Beast',
    Fiend: 'Genma',
    Enigma: 'Deity'
  };

  private static INCLUDED_SUBAPPS = {
    'Laplace': false,
    'UMA Converter': false,
    'Fiend Converter': false,
    'Enigma Converter': false
  };

  elementDemons = PrimeElements;
  includedSubapps: { [name: string]: boolean } = Object.assign({}, FusionChart.INCLUDED_SUBAPPS);

  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;

  constructor() {
    super();
    this.initCharts();
  }

  get lvlModifier(): number {
    return this.includedSubapps.Laplace ? 4 : 1;
  }

  initCharts() {
    this.fissionChart = SmtFusionChart.loadFissionChart(Races, PrimeElements, FUSION_CHART_JSON);
    this.fusionChart = SmtFusionChart.loadFusionChart(Races, FUSION_CHART_JSON);
    this.elementChart = {};

    for (const race of Races) {
      this.elementChart[race] = {};
    }

    for (const [race, json] of Object.entries(ELEMENT_MODIFIERS_JSON)) {
      for (let i = 0; i < PrimeElements.length; i++) {
        this.elementChart[race][PrimeElements[i]] = json[i];
      }
    }

    for (const [raceR, raceQ] of Object.entries(FusionChart.RACE_CONVERTERS)) {
      this.fissionChart[raceQ] = this.fissionChart[raceR];
    }
  }

  getRaceFusions(race: string): FusionRow {
    const combos = Object.assign({}, super.getRaceFusions(race));

    for (const [raceB, raceR] of Object.entries(combos)) {
      const raceQ = FusionChart.RACE_CONVERTERS[raceR];

      if (raceQ && this.isSubappOn(`${raceQ} Converter`)) {
        combos[raceB] = raceQ;
      }
    }

    return combos;
  }

  isSubappOn(subapp: string): boolean {
    return this.includedSubapps.hasOwnProperty(subapp) && this.includedSubapps[subapp];
  }
}
