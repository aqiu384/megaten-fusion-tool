import { Races, ElementDemons } from '../constants';
import { FissionTable, FusionTable, ElementTable, FissionRow, FusionRow } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';

import * as FUSION_CHART_JSON from '../data/fusion-chart.json';
import * as ELEMENT_CHART_JSON from '../data/element-chart.json';

export class FusionChart extends SmtFusionChart {
  elementDemons = ElementDemons;
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
    const elemRaces: string[] = ELEMENT_CHART_JSON['races'];
    const elemTable: number[][] = ELEMENT_CHART_JSON['table'];

    this.fusionChart = SmtFusionChart.loadFusionTableJson(races, table);
    this.fissionChart = SmtFusionChart.loadFissionTableJson(races, this.elementDemons, table);
    this.elementChart = SmtFusionChart.loadElementTableJson(elemRaces, this.elementDemons, elemTable);
  }

  getRaceFusions(race: string): FusionRow {
    const combos = Object.assign({}, super.getRaceFusions(race));
    return combos;
  }
}
