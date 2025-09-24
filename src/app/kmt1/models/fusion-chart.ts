import { FissionTable, FissionRow, FusionTable, FusionRow, ElementTable } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';
import { CompendiumConfig } from '../models';

export class FusionChart extends SmtFusionChart {
  races: string[];
  elementDemons = [];
  lvlModifier = 1.5;
  raceOrder: { [race: string]: number; };

  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;

  alignments: { [race: string]: string };

  constructor(compConfig: CompendiumConfig, isTripleChart?: boolean) {
    super();
    this.initCharts(compConfig);
  }

  initCharts(compConfig: CompendiumConfig) {
    this.raceOrder = compConfig.raceOrder;
    this.alignments = compConfig.alignData['races'];

    const races: string[] = compConfig.normalTable['races'];
    const table: string[][] = compConfig.normalTable['table'];

    const normFusions = SmtFusionChart.loadFusionTableJson(races, table);
    const normFissions = SmtFusionChart.loadFissionTableJson(races, [], table);

    this.races = races;
    this.fusionChart = normFusions;
    this.fissionChart = normFissions;

    this.elementChart = {};
  }

  getLightDark(race: string): number {
    return 0;
  }

  getRaceFissions(race: string): FissionRow {
    return this.fissionChart[race] || {};
  }

  getRaceFusions(race: string): FusionRow {
    return this.fusionChart[race] || {};
  }

  getRaceFusion(raceA: string, raceB: string): string {
    return this.getRaceFusions(raceA)[raceB] || '';
  }
}
