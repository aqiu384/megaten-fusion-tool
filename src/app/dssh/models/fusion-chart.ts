import { Races, ElementDemons } from '../constants';
import { FissionTable, FusionTable, ElementTable, FissionRow, FusionRow } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';

import * as FUSION_CHART_JSON from '../data/fusion-chart.json';
import * as DARK_CHART_JSON from '../data/dark-chart.json';
import * as ELEMENT_CHART_JSON from '../data/element-chart.json';

export class FusionChart extends SmtFusionChart {
  static readonly DARK_RACES = SmtFusionChart.DARK_RACES.concat([ 'Undead', 'Foul' ]);
  static readonly UNFUSABLE_RACES = [
    'Enigma', 'Entity', 'Reaper', 'Zealot', 'UMA',
    'Element', 'Mitama', 'Rumor', 'Hero', 'General',
    'Zoma', 'Ranger'
  ];

  elementDemons = ElementDemons;
  lvlModifier = 3;
  races: string[];

  protected fissionChart: FissionTable;
  protected fusionChart: FusionTable;
  protected elementChart: ElementTable;

  constructor(isTripleChart?: boolean) {
    super();
    this.initCharts(isTripleChart);
  }

  initCharts(isTripleChart?: boolean) {
    const darkRaces: string[] = DARK_CHART_JSON['races'];
    const darkTable: string[][] = DARK_CHART_JSON['table'];

    const races: string[] = FUSION_CHART_JSON['races'];
    const fullTable: string[][] = FUSION_CHART_JSON['table'];
    const table: string[][] = [];

    for (let i = 0; i < races.length; i++) {
      const minCol = isTripleChart ? 0 : i;
      const maxCol = isTripleChart ? i + 1 : races.length;

      table.push(fullTable[i].slice(minCol, maxCol));
    }

    const minElem = isTripleChart ? 4 : 0;
    const maxElem = isTripleChart ? 10 : 4;

    const elems: string[] = ELEMENT_CHART_JSON['elems'].slice(minElem, maxElem);
    const elemRaces: string[] = ELEMENT_CHART_JSON['races'];
    const elemTable: number[][] = ELEMENT_CHART_JSON['table'].map(row => row.slice(minElem, maxElem));

    const normFusions = SmtFusionChart.loadFusionTableJson(races, table);
    const darkFusions = SmtFusionChart.loadFusionTableJson(darkRaces, darkTable);
    this.fusionChart = SmtFusionChart.mergeFusionTables(normFusions, darkFusions);

    const normFissions = SmtFusionChart.loadFissionTableJson(races, this.elementDemons, table);
    const darkFissions = SmtFusionChart.loadFissionTableJson(darkRaces, this.elementDemons, darkTable);
    this.fissionChart = SmtFusionChart.mergeFissionTables(normFissions, darkFissions);

    this.races = Races.filter(race => FusionChart.UNFUSABLE_RACES.indexOf(race) === -1);
    this.elementChart = SmtFusionChart.loadElementTableJson(elemRaces, elems, elemTable);
    this.lvlModifier = isTripleChart ? 4 : 3;

    if (!isTripleChart) {
      this.initNormalEntityFusions();
    } else {
      this.elementDemons = elems;
    }
  }

  initNormalEntityFusions() {
    const raceBs = [ 'Vile', 'Tyrant', 'Reaper' ];
    const entityFissions: FissionRow = {};

    for (const raceA of [ 'Deity', 'Megami', 'Fury', 'Lady' ]) {
      entityFissions[raceA] = raceBs;
    }

    for (const raceR of [ 'Entity', 'Zealot' ]) {
      this.fissionChart[raceR] = entityFissions;
    }
  }

  getLightDark(race: string): number {
    if (SmtFusionChart.LIGHT_RACES.indexOf(race) !== -1) {
      return 1;
    } else if (FusionChart.DARK_RACES.indexOf(race) !== -1) {
      return -1;
    } else {
      return 0;
    }
  }
}
