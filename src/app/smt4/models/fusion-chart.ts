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
    this.fissionChart = {};
    this.fusionChart = {};
    this.elementChart = {};

    for (const race of Races) {
      this.fissionChart[race] = {};
      this.fusionChart[race] = {};
      this.elementChart[race] = {};
    }

    for (const elem of this.elementDemons) {
      this.fissionChart[elem] = {};
    }

    for (const [raceA, raceBs] of Object.entries(FUSION_CHART_JSON)) {
      for (const [raceB, raceR] of Object.entries(raceBs)) {
        if (!this.fissionChart[raceR][raceA]) {
          this.fissionChart[raceR][raceA] = [];
        }

        if (raceA !== raceB) {
          this.fusionChart[raceA][raceB] = raceR;
          this.fusionChart[raceB][raceA] = raceR;
        }

        this.fissionChart[raceR][raceA].push(raceB);
      }
    }

    for (const [race, json] of Object.entries(ELEMENT_MODIFIERS_JSON)) {
      for (const [elem, modifier] of Object.entries(json)) {
        this.elementChart[race][elem] = modifier;
      }
    }
  }
}
