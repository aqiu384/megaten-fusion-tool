import { Races, ElementDemons } from './constants';
import { FissionTable, FusionTable, ElementTable } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';

import * as FUSION_CHART_JSON from '../data/fusion-chart.json';
import * as CURSED_CHART_JSON from '../data/cursed-chart.json';
import * as ELEMENT_MODIFIERS_JSON from '../data/element-modifiers.json';

export class FusionChart extends SmtFusionChart {
  private static readonly CHART_SETTINGS = {
    'Enable Cursed Fusion': false
  };

  lvlModifier = 1;
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
    this.normalFissionChart = SmtFusionChart.loadFissionChart(Races, ElementDemons, FUSION_CHART_JSON);
    this.normalFusionChart = SmtFusionChart.loadFusionChart(Races, FUSION_CHART_JSON);
    this.normalElementChart = {};
    this.cursedFissionChart = SmtFusionChart.loadFissionChart(Races, ElementDemons, CURSED_CHART_JSON);
    this.cursedFusionChart = SmtFusionChart.loadFusionChart(Races, CURSED_CHART_JSON);
    this.cursedElementChart = {};

    for (const race of Races) {
      this.normalElementChart[race] = {};
      this.cursedElementChart[race] = {};
    }

    for (const [race, json] of Object.entries(ELEMENT_MODIFIERS_JSON)) {
      for (let i = 0; i < ElementDemons.length; i++) {
        this.normalElementChart[race][ElementDemons[i]] = json[i];
        this.cursedElementChart[race][ElementDemons[i]] = -1 * json[i];
      }
    }
  }
}
