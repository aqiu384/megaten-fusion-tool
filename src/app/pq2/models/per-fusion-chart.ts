import { FissionTable, FusionTable, ElementTable } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';
import { CompendiumConfig } from '../models';

export class PersonaFusionChart extends SmtFusionChart {
  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;

  elementDemons: string[];
  lvlModifier = 0.5;
  races: string[];
  raceOrder: { [race: string]: number; };

  constructor(compConfig: CompendiumConfig, isTripleChart: boolean) {
    super();
    this.initCharts(compConfig, isTripleChart);
  }

  initCharts(compConfig: CompendiumConfig, isTripleChart: boolean) {
    const races = compConfig.normalTable.races;
    const fullTable = compConfig.normalTable.table;
    const elems = compConfig.elementTable?.elems || [];
    const elemRaces = compConfig.elementTable?.races || [];
    const elemTable = compConfig.elementTable?.table || [];
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
    this.raceOrder = compConfig.raceOrder
    this.lvlModifier = isTripleChart ? 4.25 : 0.5;
    this.fusionChart = SmtFusionChart.loadFusionTableJson(races, fullTable[0].length === 1 ? fullTable : table);
    this.fissionChart = SmtFusionChart.loadFissionTableJson(races, elems, fullTable[0].length === 1 ? fullTable : table);
    this.elementChart = elems.length ? SmtFusionChart.loadElementTableJson(elemRaces, elems, elemTable) : {};
  }
}
