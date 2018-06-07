import { Races, ElementDemons } from './constants';
import { FissionTable, FusionTable, ElementTable } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';

import * as FUSION_CHART_JSON from '../data/fusion-chart.json';
import * as CURSED_CHART_JSON from '../data/cursed-chart.json';
import * as ELEMENT_CHART_JSON from '../data/element-chart.json';

export class FusionChart extends SmtFusionChart {
  private static readonly CHART_SETTINGS = {
    'Enable Cursed Fusion': false
  };

  lvlModifier = 0.5;
  races: string[];
  elementDemons = ElementDemons;
  chartSettings: { [name: string]: boolean } = Object.assign({}, FusionChart.CHART_SETTINGS);

  private cursedFissionChart: FissionTable;
  private cursedFusionChart: FusionTable;
  private cursedElementChart: ElementTable;

  private normalFissionChart: FissionTable;
  private normalFusionChart: FusionTable;
  private normalElementChart: ElementTable;

  get isCursed(): boolean {
    return this.chartSettings['Enable Cursed Fusion'];
  }

  protected get fissionChart(): FissionTable {
    return this.isCursed ? this.cursedFissionChart : this.normalFissionChart;
  }

  protected get fusionChart(): FusionTable {
    return this.isCursed ? this.cursedFusionChart : this.normalFusionChart;
  }

  protected get elementChart(): ElementTable {
    return this.isCursed ? this.cursedElementChart : this.normalElementChart;
  }

  constructor() {
    super();
    this.initCharts();
  }

  initCharts() {
    const normRaces: string[] = FUSION_CHART_JSON['races'];
    const normTable: string[][] = FUSION_CHART_JSON['table'];
    const cursRaces: string[] = CURSED_CHART_JSON['races'];
    const cursTable: string[][] = CURSED_CHART_JSON['table'];

    const elems: string[] = ELEMENT_CHART_JSON['elems'];
    const elemRaces: string[] = ELEMENT_CHART_JSON['races'];
    const elemTable: number[][] = ELEMENT_CHART_JSON['table'];

    this.races = normRaces;

    this.normalFusionChart = SmtFusionChart.loadFusionTableJson(normRaces, normTable);
    this.normalFissionChart = SmtFusionChart.loadFissionTableJson(normRaces, elems, normTable);
    this.normalElementChart = SmtFusionChart.loadElementTableJson(elemRaces, elems, elemTable);

    this.cursedFusionChart = SmtFusionChart.loadFusionTableJson(cursRaces, cursTable);
    this.cursedFissionChart = SmtFusionChart.loadFissionTableJson(cursRaces, elems, cursTable);
    this.cursedElementChart = SmtFusionChart.loadElementTableJson(elemRaces, elems, elemTable);

    for (const row of Object.values(this.cursedElementChart)) {
      for (const elem of Object.keys(row)) {
        row[elem] *= -1;
      }
    }
  }

  getLightDark(race: string): number {
    return 0;
  }
}
