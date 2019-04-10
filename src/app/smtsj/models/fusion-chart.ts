import { Races, PrimeElements } from './constants';
import { FissionTable, FusionTable, ElementTable, FissionRow, FusionRow } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';

import FUSION_CHART_JSON from '../data/fusion-chart.json';
import ELEMENT_CHART_JSON from '../data/element-chart.json';

export class FusionChart extends SmtFusionChart {
  private static RACE_CONVERTERS = {
    Beast: 'UMA',
    Genma: 'Fiend',
    Deity: 'Enigma'
  };

  private static INVERSE_RACE_CONVERTERS = {
    UMA: 'Beast',
    Fiend: 'Genma',
    Enigma: 'Deity'
  };

  private static INCLUDED_SUBAPPS = {
    'Laplace': false,
    'UMA Converter': false,
    'Fiend Converter': false,
    'Enigma Converter': false
  };

  elementDemons = PrimeElements;
  includedSubapps: { [name: string]: boolean } = Object.assign({}, FusionChart.INCLUDED_SUBAPPS);
  races: string[];

  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;

  constructor() {
    super();
    this.initCharts();
  }

  get lvlModifier(): number {
    return this.includedSubapps.Laplace ? 4 : 1;
  }

  initCharts() {
    const races: string[] = FUSION_CHART_JSON['races'];
    const elems: string[] = ELEMENT_CHART_JSON['elems'];
    const table: string[][] = FUSION_CHART_JSON['table'];
    const elemRaces: string[] = ELEMENT_CHART_JSON['races'];
    const elemTable: number[][] = ELEMENT_CHART_JSON['table'];

    this.fusionChart = SmtFusionChart.loadFusionTableJson(races, table);
    this.fissionChart = SmtFusionChart.loadFissionTableJson(races, elems, table);
    this.elementChart = SmtFusionChart.loadElementTableJson(elemRaces, elems, elemTable);
    this.races = races;

    for (const [raceR, raceQ] of Object.entries(FusionChart.RACE_CONVERTERS)) {
      this.fissionChart[raceQ] = this.fissionChart[raceR];
    }
  }

  getRaceFusions(race: string): FusionRow {
    const combos = Object.assign({}, super.getRaceFusions(race));

    for (const [raceB, raceR] of Object.entries(combos)) {
      const raceQ = FusionChart.RACE_CONVERTERS[raceR];

      if (raceQ && this.isSubappOn(`${raceQ} Converter`)) {
        combos[raceB] = raceQ;
      }
    }

    return combos;
  }

  isSubappOn(subapp: string): boolean {
    return this.includedSubapps.hasOwnProperty(subapp) && this.includedSubapps[subapp];
  }
}
