import { FissionTable, FissionRow, FusionTable, FusionRow, ElementTable } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';
import { CompendiumConfig } from '../models';

export class FusionChart extends SmtFusionChart {
  races: string[];
  elementDemons = [];
  lvlModifier = 1.5;
  speciesLookup: { [race: string]: string };

  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;

  alignments: { [race: string]: string };

  constructor(compConfig: CompendiumConfig) {
    super();
    this.initCharts(compConfig);
  }

  initCharts(compConfig: CompendiumConfig) {
    const races: string[] = compConfig.normalTable['races'];
    const table: string[][] = compConfig.normalTable['table'];

    this.races = races;
    this.alignments = compConfig.alignData['races'];
    this.elementDemons = compConfig.elementTable['elems'];
    this.speciesLookup = compConfig.speciesLookup;

    this.fusionChart = SmtFusionChart.loadFusionTableJson(races, table);
    this.fissionChart = SmtFusionChart.loadFissionTableJson(races, [], table);
    this.elementChart = SmtFusionChart.loadElementTableJson(
      compConfig.elementTable['races'],
      this.elementDemons,
      compConfig.elementTable['table']
    );
  }

  getLightDark(race: string): number {
    if (this.alignments[race].charAt(0) == 'l') {
      return 0;
    } else if (this.alignments[race].charAt(0) == 'd') {
      return 1;
    } else {
      return 0;
    }
  }

  getRaceFissions(race: string): FissionRow {
    return Object.assign({},
      this.fissionChart[race] || {},
      this.fissionChart[this.speciesLookup[race]] || {}
    );
  }

  getRaceFusions(race: string): FusionRow {
    return this.fusionChart[race] || {};
  }

  getRaceFusion(raceA: string, raceB: string): string {
    return this.getRaceFusions(raceA)[raceB] || '';
  }
}
