import { FissionTable, FusionTable, ElementTable } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';

import * as FUSION_CHART_JSON from '../data/fusion-chart.json';

export class FusionChart extends SmtFusionChart {
  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;
  elementDemons = [];
  lvlModifier = 1;

  constructor(fusionTableJson: any, races: string [], isTripleChart?: boolean) {
    super();
    this.initCharts(fusionTableJson, races, isTripleChart);
  }

  initCharts(fusionTableJson: any, races: string[], isTripleChart?: boolean) {
    const chart: FusionTable = {};

    for (const race of races) {
      chart[race] = {};
    }

    for (let i = 0; i < races.length; i++) {
      const raceA = races[i];
      const row = fusionTableJson[i];

      const milCol = isTripleChart ? 0 : i + 1;
      const maxCol = isTripleChart ? i + 1 : races.length;

      for (let j = milCol; j < maxCol; j++) {
        const raceB = races[j];
        const raceR = row[j];

        if (raceR !== 'NOTHING') {
          chart[raceA][raceB] = raceR;
        }
      }
    }

    this.fissionChart = SmtFusionChart.loadFissionChart(races, this.elementDemons, chart);
    this.fusionChart = SmtFusionChart.loadFusionChart(races, chart);
    this.elementChart = {};

    for (const race of races) {
      this.elementChart[race] = {};
    }
  }
}
