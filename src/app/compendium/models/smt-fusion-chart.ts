import {
  FusionChart,
  FissionTable,
  FusionTable,
  ElementTable,
  FissionRow,
  FusionRow,
  ElementRow,
  ElemModifiers
} from '../models';

export abstract class SmtFusionChart implements FusionChart {
  static readonly LIGHT_RACES = [
    'Herald', 'Megami', 'Avian', 'Tree',
    'Deity', 'Avatar', 'Holy', 'Genma',
    'Fury', 'Lady', 'Dragon', 'Kishin',
    'Enigma', 'Geist', 'Entity',
    'Amatsu', 'Kunitsu', 'Godly', 'Chaos'
  ];

  static readonly DARK_RACES = [
    'Vile', 'Raptor', 'Wood',
    'Reaper', 'Wilder', 'Jaki', 'Vermin',
    'Tyrant', 'Drake', 'Spirit',
    'Haunt', 'Ghost', 'Zealot'
  ];

  protected abstract fissionChart: FissionTable;
  protected abstract fusionChart: FusionTable;
  protected abstract elementChart: ElementTable;

  abstract races: string[];
  abstract lvlModifier: number;
  abstract elementDemons: string[];

  static loadFusionTableJson(races: string[], table: string[][]): FusionTable {
    const fusionTable: FusionTable = {};
    const isInverted = table[0].length === 1;

    for (const race of races) {
      fusionTable[race] = {};
    }

    for (let r = 0; r < table.length; r++) {
      const raceA = races[r];
      const row = table[r];
      const cOffset = isInverted ? 0 : races.length - row.length;

      for (let c = 0; c < row.length; c++) {
        const raceB = races[c + cOffset];
        const raceR = row[c];

        if (raceR !== '-') {
          fusionTable[raceA][raceB] = raceR;
          fusionTable[raceB][raceA] = raceR;
        }
      }
    }

    return fusionTable;
  }

  static loadFissionTableJson(races: string[], elems: string[], table: string[][]): FissionTable {
    const fissionTable: FissionTable = {};
    const isInverted = table[0].length === 1;

    for (let r = 0; r < table.length; r++) {
      const raceA = races[r];
      const row = table[r];
      const cOffset = isInverted ? 0 : races.length - row.length;

      for (let c = 0; c < row.length; c++) {
        const raceB = races[c + cOffset];
        const raceR = row[c];

        if (raceR !== '-') {
          if (!fissionTable[raceR]) {
            fissionTable[raceR] = {};
          }

          if (!fissionTable[raceR][raceA]) {
            fissionTable[raceR][raceA] = [];
          }

          fissionTable[raceR][raceA].push(raceB);
        }
      }
    }

    return fissionTable;
  }

  static loadElementTableJson(races: string[], elems: string[], table: number[][]): ElementTable {
    const elementTable: ElementTable = {};

    for (const elem of elems) {
      elementTable[elem] = {};
    }

    for (let r = 0; r < table.length; r++) {
      const race = races[r];
      const row = table[r];

      for (let c = 0; c < row.length; c++) {
        const elem = elems[c];
        const modi = table[r][c];

        if (modi) {
          elementTable[elem][race] = modi;
        }
      }
    }

    return elementTable;
  }

  static mergeFusionTables(table1: FusionTable, table2: FusionTable): FusionTable {
    const table: FusionTable = {};

    for (const [raceA, raceBs] of Object.entries(table1)) {
      table[raceA] = Object.assign({}, raceBs);
    }

    for (const [raceA, raceBs] of Object.entries(table2)) {
      table[raceA] = Object.assign(table[raceA] || {}, raceBs);
    }

    return table;
  }

  static mergeFissionTables(table1: FissionTable, table2: FissionTable): FissionTable {
    const table: FissionTable = {};

    for (const [raceR, raceAs] of Object.entries(table1)) {
      table[raceR] = {};

      for (const [raceA, raceBs] of Object.entries(raceAs)) {
        table[raceR][raceA] = raceBs.slice();
      }
    }

    for (const [raceR, raceAs] of Object.entries(table2)) {
      table[raceR] = table[raceR] || {};

      for (const [raceA, raceBs] of Object.entries(raceAs)) {
        table[raceR][raceA] = raceBs.concat(table[raceR][raceA] || []);
      }
    }

    return table;
  }

  getLightDark(race: string): number {
    if (SmtFusionChart.LIGHT_RACES.indexOf(race) !== -1) {
      return 1;
    } else if (SmtFusionChart.DARK_RACES.indexOf(race) !== -1) {
      return -1;
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

  getElemModifiers(race: string): ElemModifiers {
    const modifiers: ElemModifiers = {};

    for (const [elem, races] of Object.entries(this.elementChart)) {
      const mod = races[race];

      if (mod) {
        if (!modifiers[mod]) {
          modifiers[mod] = [];
        }

        modifiers[mod].push(elem);
      }
    }

    return modifiers;
  }

  getElemFusions(elem: string): ElementRow {
    return this.elementChart[elem] || {};
  }

  isConvertedRace(race: string): boolean {
    return false;
  }
}
