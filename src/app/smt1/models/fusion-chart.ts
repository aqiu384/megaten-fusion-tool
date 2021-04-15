import { FissionTable, FissionRow, FusionTable, FusionRow, ElementTable } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';
import { CompendiumConfig } from '../models';

export class FusionChart extends SmtFusionChart {
  races: string[];
  elementDemons = [];
  lvlModifier = 1.5;
  speciesLookup: { [race: string]: string };
  hasDarkTable = false;

  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;

  alignments: { [race: string]: string };

  constructor(compConfig: CompendiumConfig, isTripleChart?: boolean) {
    super();
    this.initCharts(compConfig, isTripleChart);
  }

  initCharts(compConfig: CompendiumConfig, isTripleChart?: boolean) {
    this.alignments = compConfig.alignData['races'];
    this.speciesLookup = compConfig.speciesLookup;
    this.elementDemons = isTripleChart ?
      compConfig.tripleElementTable['elems'] :
      compConfig.elementTable['elems'];

    const races: string[] = isTripleChart ?
      compConfig.tripleTable['races'] :
      compConfig.normalTable['races'];
    const table: string[][] = isTripleChart ?
      compConfig.tripleTable['table'] :
      compConfig.normalTable['table'];

    const normFusions = SmtFusionChart.loadFusionTableJson(races, table);
    const normFissions = SmtFusionChart.loadFissionTableJson(races, [], table);

    this.lvlModifier = isTripleChart ? compConfig.tripleLvlModifier : compConfig.normalLvlModifier;

    if (compConfig.darkTable) {
      this.hasDarkTable = true;

      const darkRaces: string[] = isTripleChart && compConfig.tripleDarkTable ?
        compConfig.tripleDarkTable['races'] :
        compConfig.darkTable['races'];
      const darkTable: string[][] = isTripleChart && compConfig.tripleDarkTable ?
        compConfig.tripleDarkTable['table'] :
        compConfig.darkTable['table'];

      const darkFusions = SmtFusionChart.loadFusionTableJson(darkRaces, darkTable);
      const darkFissions = SmtFusionChart.loadFissionTableJson(darkRaces, [], darkTable);

      this.races = races.concat(darkRaces.filter(r => this.getLightDark(r) < 0));
      this.fusionChart = SmtFusionChart.mergeFusionTables(normFusions, darkFusions);
      this.fissionChart = SmtFusionChart.mergeFissionTables(normFissions, darkFissions);
    } else {
      this.races = races;
      this.fusionChart = normFusions;
      this.fissionChart = normFissions;
    }

    if (compConfig.darknessRecipes) {
      for (const [raceD, raceRO] of Object.entries(compConfig.darknessRecipes)) {
        const raceR = <string>raceRO;
        this.fusionChart[raceD] = {};
        this.fusionChart[raceD][raceD] = raceR;
        this.fissionChart[raceR] = {};
        this.fissionChart[raceR][raceD] = [raceD];

        if (!this.races.includes(raceD)) {
          this.races.push(raceD);
        }
      }
    }

    if (compConfig.useSpeciesFusion) {
      for (const raceR of this.races) {
        const raceFissions = this.getRaceFissions(raceR);

        for (const [raceA, raceBs] of Object.entries(this.getRaceFissions(this.speciesLookup[raceR]))) {
          if (!raceFissions[raceA]) {
            raceFissions[raceA] = [];
          }

          for (const raceB of raceBs) {
            raceFissions[raceA].push(raceB);
          }
        }
      }
    }

    this.elementChart = SmtFusionChart.loadElementTableJson(
      compConfig.elementTable['races'],
      this.elementDemons,
      isTripleChart ?
        compConfig.tripleElementTable['table'] :
        compConfig.elementTable['table']
    );
  }

  getLightDark(race: string): number {
    if (this.alignments[race].charAt(0) == 'l') {
      return 1;
    } else if (this.alignments[race].charAt(0) == 'd') {
      return -1;
    } else if (this.alignments[race].charAt(0) == 'D') {
      return -2;
    } else {
      return 0;
    }
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
