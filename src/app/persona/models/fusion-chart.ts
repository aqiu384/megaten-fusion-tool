import { FissionTable, FusionTable, ElementTable } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';

export class FusionChart extends SmtFusionChart {
  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;

  elementDemons = [];
  lvlModifier = 1;

  constructor(fusionTableJson: any, races: string[], isTripleChart?: boolean) {
    super();
    this.initCharts(fusionTableJson, isTripleChart);
  }

  initCharts(fusionTableJson: any, isTripleChart?: boolean) {
    const races: string[] = fusionTableJson['races'];
    const fullTable: string[][] = fusionTableJson['table'];
    const table: string[][] = [];

    for (let i = 0; i < races.length; i++) {
      const minCol = isTripleChart ? 0 : i;
      const maxCol = isTripleChart ? i + 1 : races.length;

      table.push(fullTable[i].slice(minCol, maxCol));

      if (!isTripleChart) {
        table[i][0] = '-';
      }
    }

    this.fissionChart = SmtFusionChart.loadFissionTableJson(races, this.elementDemons, table);
    this.fusionChart = SmtFusionChart.loadFusionTableJson(races, table);
    this.elementChart = {};
  }
}
