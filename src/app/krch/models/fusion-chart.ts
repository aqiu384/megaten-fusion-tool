import { FissionTable, FusionTable, ElementTable, FusionRow } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';
import { CompendiumConfig } from '../models';

export class FusionChart extends SmtFusionChart {
  races: string[];
  elementDemons: string[];
  lvlModifier: number;

  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;

  constructor(compConfig: CompendiumConfig) {
    super();
    this.initCharts(compConfig);
  }

  initCharts(compConfig: CompendiumConfig) {
    const races = compConfig.normalTable.races;
    const table = compConfig.normalTable.table;
    const elems = compConfig.elementTable.elems;
    const elemRaces = compConfig.elementTable.races;
    const elemTable = compConfig.elementTable.table;

    this.races = races;
    this.elementDemons = elems;
    this.lvlModifier = compConfig.fusionLvlMod;

    this.fusionChart = SmtFusionChart.loadFusionTableJson(races, table);
    this.fissionChart = SmtFusionChart.loadFissionTableJson(races, [], table);
    this.elementChart = {};

    if (elems.length) {
      this.elementChart = SmtFusionChart.loadElementTableJson(elemRaces, elems, elemTable);
    } else {
      this.elementChart = races.reduce((acc, r) => { acc[r] = []; return acc; }, {})
    }
  }

  getLightDark(race: string): number {
    return 0;
  }

  getRaceFusions(race: string): FusionRow {
    const combos = Object.assign({}, super.getRaceFusions(race));
    return combos;
  }
}
