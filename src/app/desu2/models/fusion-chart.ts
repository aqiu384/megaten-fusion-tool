import { ElementDemons, Races } from '../../desu/constants';
import { FissionTable, FusionTable, ElementTable } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';

import * as ELEMENT_MODIFIERS_JSON from '../../desu1/data/element-modifiers.json';
import * as FUSION_CHART_JSON from '../data/fusion-chart.json';

export class FusionChart extends SmtFusionChart {
  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;
  elementDemons = ElementDemons;
  lvlModifier = 1;

  constructor() {
    super();
    this.initCharts();
  }

  initCharts() {
    const chart: FusionTable = {};

    for (const race of Races) {
      chart[race] = {};
    }

    for (let i = 0; i < 22; i++) {
      const raceA = Races[i];
      const row = FUSION_CHART_JSON[i];

      for (let j = i; j < 22; j++) {
        const raceB = Races[j];
        const raceR = row[j - i];

        chart[raceA][raceB] = raceR;
      }
    }

    this.fissionChart = SmtFusionChart.loadFissionChart(Races, ElementDemons, chart);
    this.fusionChart = SmtFusionChart.loadFusionChart(Races, chart);
    this.elementChart = {};

    for (const race of Races) {
      this.elementChart[race] = {};
    }

    for (const [race, json] of Object.entries(ELEMENT_MODIFIERS_JSON)) {
      for (let i = 0; i < ElementDemons.length; i++) {
        this.elementChart[race][ElementDemons[i]] = json[i];
      }
    }
  }
}
