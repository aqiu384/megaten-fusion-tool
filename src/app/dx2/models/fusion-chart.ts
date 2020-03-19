import { Races } from '../constants';
import { FissionTable, FusionTable, ElementTable } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';

import FUSION_CHART_JSON from '../data/fusion-chart.json';

export class FusionChart extends SmtFusionChart {
  races: string[];
  elementDemons = [];
  lvlModifier = 0.5;

  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;

  constructor() {
    super();
    this.initCharts();
  }

  initCharts() {
    const races: string[] = FUSION_CHART_JSON['races'];
    const table: string[][] = FUSION_CHART_JSON['table'];

    this.races = races;
    this.fusionChart = SmtFusionChart.loadFusionTableJson(races, table);
    this.fissionChart = SmtFusionChart.loadFissionTableJson(races, [], table);
    this.elementChart = {};

    for (const race of Races) {
      this.elementChart[race] = {};
    }
  }

  getLightDark(race: string): number {
    return 0;
  }
}
