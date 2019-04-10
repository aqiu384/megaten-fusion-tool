import { ElementDemons } from './constants';
import { FissionTable, FusionTable, ElementTable } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';

import ELEMENT_CHART_JSON from '../data/element-chart.json';

export class FusionChart extends SmtFusionChart {
  lvlModifier = 1;
  elementDemons = ElementDemons;
  races: string[];

  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;

  constructor(fusionChartJson: any) {
    super();
    this.initCharts(fusionChartJson);
  }

  initCharts(fusionChartJson: any) {
    const races: string[] = fusionChartJson['races'];
    const elems: string[] = ELEMENT_CHART_JSON['elems'];
    const table: string[][] = fusionChartJson['table'];
    const elemRaces: string[] = ELEMENT_CHART_JSON['races'];
    const elemTable: number[][] = ELEMENT_CHART_JSON['table'];

    this.fusionChart = SmtFusionChart.loadFusionTableJson(races, table);
    this.fissionChart = SmtFusionChart.loadFissionTableJson(races, elems, table);
    this.elementChart = SmtFusionChart.loadElementTableJson(elemRaces, elems, elemTable);
    this.races = races;
  }
}
