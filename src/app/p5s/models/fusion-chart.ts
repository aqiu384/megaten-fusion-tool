import { FissionTable, FusionTable, ElementTable } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';

export class FusionChart extends SmtFusionChart {
  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;

  elementDemons = [];
  lvlModifier = 0.5;
  races: string[];
  raceOrder: { [race: string]: number; };

  constructor(races: string[]) {
    super();
    this.initCharts(races);
  }

  initCharts(races: string[]) {
    this.races = races;
    this.raceOrder = races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    this.fusionChart = SmtFusionChart.loadFusionTableJson(['Fool'], [['-']]);
    this.fissionChart = SmtFusionChart.loadFissionTableJson(['Fool'], [], [['-']]);
    this.elementChart = {};
  }
}
