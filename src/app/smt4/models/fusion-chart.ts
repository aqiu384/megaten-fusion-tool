import { Races, ElementDemons } from './constants';
import { FissionChart, FuusionChart, ElementChart } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';

import * as FUSION_CHART_JSON from '../data/fusion-chart.json';
import * as ELEMENT_MODIFIERS_JSON from '../data/element-modifiers.json';

export class FusionChart extends SmtFusionChart {
  lvlModifier = 0;
  elementDemons = ElementDemons;

  protected fissionChart: FissionChart;
  protected fusionChart: FuusionChart;
  protected elementChart: ElementChart;

  constructor() {
    super();
    this.initCharts();
  }

  initCharts() {
    this.fissionChart = SmtFusionChart.loadFissionChart(Races, ElementDemons, FUSION_CHART_JSON);
    this.fusionChart = SmtFusionChart.loadFusionChart(Races, FUSION_CHART_JSON);
    this.elementChart = {};

    for (const race of Races) {
      this.elementChart[race] = {};
    }

    for (const [race, json] of Object.entries(ELEMENT_MODIFIERS_JSON)) {
      for (const [elem, modifier] of Object.entries(json)) {
        this.elementChart[race][elem] = modifier;
      }
    }
  }
}
