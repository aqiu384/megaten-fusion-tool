import { Races } from '../constants';
import { FissionTable, FusionTable, ElementTable } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';

import * as FUSION_CHART_JSON from '../data/fusion-chart.json';

export class TriangleNormalChart extends SmtFusionChart {
  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;
  elementDemons = [];
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

    for (let i = 0; i < Races.length; i++) {
      const raceA = Races[i];
      const row = FUSION_CHART_JSON[i];

      for (let j = i; j < Races.length; j++) {
        const raceB = Races[j];
        const raceR = row[j];

        if (raceR !== 'NOTHING') {
          chart[raceA][raceB] = raceR;
        }
      }
    }

    this.fissionChart = SmtFusionChart.loadFissionChart(Races, this.elementDemons, chart);
    this.fusionChart = SmtFusionChart.loadFusionChart(Races, chart);
    this.elementChart = {};

    for (const race of Races) {
      this.elementChart[race] = {};
    }
  }
}
