import { Races } from '../constants';
import { FissionTable, FusionTable, ElementTable, FissionRow, FusionRow } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';

import * as FUSION_CHART_JSON from '../data/fusion-chart.json';

export class FusionChart extends SmtFusionChart {
  elementDemons = [];
  lvlModifier = 3;

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

    this.fusionChart = SmtFusionChart.loadFusionTableJson(races, table);
    this.fissionChart = SmtFusionChart.loadFissionTableJson(races, [], table);
    this.elementChart = {};

    for (const race of Races) {
      this.elementChart[race] = {};
    }
  }

  getRaceFusions(race: string): FusionRow {
    const combos = Object.assign({}, super.getRaceFusions(race));
    return combos;
  }
}
