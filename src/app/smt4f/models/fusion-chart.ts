import { FissionTable, FusionTable, ElementTable } from '../../compendium/models';
import { SmtFusionChart } from '../../compendium/models/smt-fusion-chart';
import { CompendiumConfig } from '../models';

export class FusionChart extends SmtFusionChart {
  lvlModifier = 1;
  elementDemons: string[];
  races: string[];

  static readonly LIGHT_RACES = [
    'Herald', 'Megami', 'Avian', 'Tree',
    'Deity', 'Avatar', 'Holy', 'Genma',
    'Fury', 'Lady', 'Dragon', 'Kishin',
    'Enigma', 'Entity', 'Wargod',
    'Amatsu', 'Kunitsu', 'Godly', 'Chaos',
    '大天使', '女神', '霊鳥', '神樹',
    '魔神', '神獣', '聖獣', '幻魔',
    '破壊神', '地母神', '龍神', '鬼神',
    '秘神', '威霊', '軍神',
    '天津神', '国津神', '神霊', '混沌王',
  ];

  static readonly DARK_RACES = [
    'Vile', 'Raptor', 'Wood',
    'Reaper', 'Wilder', 'Jaki', 'Vermin',
    'Tyrant', 'Drake', 'Spirit',
    'Haunt', 'Ghost', 'Zealot',
    '邪神', '凶鳥', '妖樹',
    '死神', '妖獣', '邪鬼', '幽虫',
    '魔王', '邪龍', '悪霊',
    '幽鬼', '幽鬼', '狂神'
  ];

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

  getLightDark(race: string): number {
    if (FusionChart.LIGHT_RACES.indexOf(race) !== -1) { return 1; }
    if (FusionChart.DARK_RACES.indexOf(race) !== -1) { return -1; }
    return 0;
  }
}
