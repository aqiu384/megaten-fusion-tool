import { FissionTable, FusionTable, ElementTable } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';
import { CompendiumConfig } from '../models';

import FUSION_CHART_JSON from '../data/fusion-chart.json';
import ELEMENT_CHART_JSON from '../data/element-chart.json';

export class FusionChart extends SmtFusionChart {
  races: string[];
  elementDemons = [];
  lvlModifier = 2.5;
  raceOrder: { [race: string]: number; };

  fuseColors: string[];
  fuseInherits: string[];

  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;

  constructor(compConfig: CompendiumConfig) {
    super();
    this.initCharts(compConfig);
  }

  initCharts(compConfig: CompendiumConfig) {
    const races: string[] = FUSION_CHART_JSON['races'];
    const table: string[][] = FUSION_CHART_JSON['table'];
    const elemRaces: string[] = ELEMENT_CHART_JSON['races'];
    const elemTable: number[][] = ELEMENT_CHART_JSON['table'];
    const elems: string[] = ELEMENT_CHART_JSON['elems'];

    this.races = races;
    this.elementDemons = elems;
    this.raceOrder = compConfig.raceOrder;
    this.fusionChart = SmtFusionChart.loadFusionTableJson(races, table);
    this.fissionChart = SmtFusionChart.loadFissionTableJson(races, elems, table);
    this.elementChart = SmtFusionChart.loadElementTableJson(elemRaces, elems, elemTable);

    this.fuseColors = FUSION_CHART_JSON['colors'];
    this.fuseInherits = FUSION_CHART_JSON['inherits'];
  }

  getLightDark(race: string): number {
    return 0;
  }
}
