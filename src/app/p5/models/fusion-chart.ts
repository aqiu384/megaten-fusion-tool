import { FissionTable, FusionTable, ElementTable } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';

export class FusionChart extends SmtFusionChart {
  lvlModifier = 0.5;
  elementDemons: string[];
  races: string[];

  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;

  constructor(normalTableJson: any, elementTableJson: any) {
    super();
    this.initCharts(normalTableJson, elementTableJson);
  }

  initCharts(normalTableJson: any, elementTableJson: any) {
    const races: string[] = normalTableJson['races'];
    const table: string[][] = normalTableJson['table'];
    const elems: string[] = elementTableJson['elems'];
    const elemRaces: string[] = elementTableJson['races'];
    const elemTable: number[][] = elementTableJson['table'];

    this.elementDemons = elems;
    this.fusionChart = SmtFusionChart.loadFusionTableJson(races, table);
    this.fissionChart = SmtFusionChart.loadFissionTableJson(races, elems, table);
    this.elementChart = SmtFusionChart.loadElementTableJson(elemRaces, elems, elemTable);
    this.races = races;
  }
}
