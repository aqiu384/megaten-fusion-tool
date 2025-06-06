import { FissionTable, FusionTable, ElementTable, FusionTableData, ElementTableData } from '../models';
import { SmtFusionChart } from '../models/smt-fusion-chart';

export class PersonaFusionChart extends SmtFusionChart {
  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;

  elementDemons: string[];
  lvlModifier = 0.5;
  races: string[];

  constructor(fusionTableJson: FusionTableData, elementTableData: ElementTableData, isTripleChart?: boolean) {
    super();
    this.initCharts(fusionTableJson, elementTableData, isTripleChart);
  }

  initCharts(fusionTableJson: FusionTableData, elementTableData: ElementTableData, isTripleChart: boolean) {
    const races = fusionTableJson.races
    const fullTable = fusionTableJson.table;
    const elems = elementTableData?.elems || [];
    const elemRaces = elementTableData?.races || [];
    const elemTable = elementTableData?.table || [];
    const table: string[][] = [];

    for (let i = 0; i < races.length; i++) {
      const minCol = isTripleChart ? 0 : i;
      const maxCol = isTripleChart ? i + 1 : races.length;

      table.push(fullTable[i].slice(minCol, maxCol));

      if (!isTripleChart) {
        table[i][0] = '-';
      }
    }

    this.races = races;
    this.elementDemons = elems;
    this.lvlModifier = isTripleChart ? 4.25 : 0.5;
    this.fusionChart = SmtFusionChart.loadFusionTableJson(races, fullTable[0].length === 1 ? fullTable : table);
    this.fissionChart = SmtFusionChart.loadFissionTableJson(races, elems, fullTable[0].length === 1 ? fullTable : table);
    this.elementChart = elems.length ? SmtFusionChart.loadElementTableJson(elemRaces, elems, elemTable) : {};
  }
}
