import { FissionTable, FissionRow, FusionTable, FusionRow, ElementTable } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';

export class FusionChart extends SmtFusionChart {
  races: string[];
  elementDemons = [];
  lvlModifier = 1.5;
  speciesLookup: { [race: string]: string };

  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;

  alignments: { [race: string]: string };

  constructor(normalJson, elementJson, alignJson) {
    super();
    this.initCharts(normalJson, elementJson, alignJson);
  }

  initCharts(normalJson, elementJson, alignJson) {
    const races: string[] = normalJson['races'];
    const table: string[][] = normalJson['table'];
    const species: { [species: string]: string[] } = alignJson['species'];

    this.races = races;
    this.alignments = alignJson['races'];
    this.elementDemons = elementJson['elems'];

    this.fusionChart = SmtFusionChart.loadFusionTableJson(races, table);
    this.fissionChart = SmtFusionChart.loadFissionTableJson(races, [], table);
    this.elementChart = SmtFusionChart.loadElementTableJson(
      elementJson['races'],
      this.elementDemons,
      elementJson['table']
    );

    this.speciesLookup = {};

    for (const [spec, races] of Object.entries(species)) {
      for (const race of races) {
        this.speciesLookup[race] = spec;
      }
    }
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
