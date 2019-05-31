import { FissionTable, FusionTable, ElementTable } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';
import { CompendiumConfig } from '../models';

export class FusionChart extends SmtFusionChart {
  lvlModifier = 1;
  elementDemons: string[];
  races: string[];

  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;

  constructor(compConfig: CompendiumConfig) {
    super();
    this.initCharts(compConfig);
  }

  initCharts(compConfig: CompendiumConfig) {
    const races: string[] = compConfig.normalTable['races'];
    const table: string[][] = compConfig.normalTable['table'];
    const elems: string[] = compConfig.elementTable['elems'];
    const elemRaces: string[] = compConfig.elementTable['races'];
    const elemTable: number[][] = compConfig.elementTable['table'];

    this.elementDemons = elems;
    this.fusionChart = SmtFusionChart.loadFusionTableJson(races, table);
    this.fissionChart = SmtFusionChart.loadFissionTableJson(races, elems, table);
    this.elementChart = SmtFusionChart.loadElementTableJson(elemRaces, elems, elemTable);
    this.races = races;
  }
}
