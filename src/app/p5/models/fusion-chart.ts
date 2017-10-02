import { Races, RaceOrder } from './constants';
import { FusionChart as IFusionChart } from '../../compendium/models';

import * as FUSION_CHART_JSON from '../data/fusion-chart.json';
import * as ELEMENT_MODIFIERS_JSON from '../data/element-modifiers.json';

export class FusionChart implements IFusionChart {
  forwardFusionChart: { [race1: string]: { [race2: string]: string } };
  elementModifiers: { [race: string]: { [element: string]: number } };
  reverseFusionChart: { [raceR: string]: { ingRace1: string, ingRace2: string }[] };

  constructor() {
    this.initImportedData();
    this.initDerivedData();
  }

  initImportedData() {
    const fusionChart: { [race1: string]: { [race2: string]: string } } = {};
    const elementModifiers: { [race: string]: { [element: string]: number } } = {};

    for (let raceIndex1 = 0; raceIndex1 < Races.length; raceIndex1++) {
      fusionChart[Races[raceIndex1]] = {};

      for (let raceIndex2 = 0; raceIndex2 < Races.length; raceIndex2++) {
        const fusionResult = FUSION_CHART_JSON[raceIndex1][raceIndex2];

        if (fusionResult && fusionResult !== '-') {
          fusionChart[Races[raceIndex1]][Races[raceIndex2]] = fusionResult;
        }
      }
    }

    for (const [name, json] of Object.entries(ELEMENT_MODIFIERS_JSON)) {
      elementModifiers[name] = json;
    }

    this.forwardFusionChart = fusionChart;
    this.elementModifiers = elementModifiers;
  }

  initDerivedData() {
    const fusionChart: { [raceR: string]: { ingRace1: string, ingRace2: string }[] } = {};

    for (const race of Races) {
      fusionChart[race] = [];
    }

    for (const [ingRace1, fusionRow] of Object.entries(this.forwardFusionChart)) {
      for (const [ingRace2, resultRace] of Object.entries(fusionRow)) {
        if (RaceOrder[ingRace1] < RaceOrder[ingRace2]) {
          fusionChart[resultRace].push({ ingRace1, ingRace2 });
        }
      }
    }

    this.reverseFusionChart = fusionChart;
  }

  getReverseFusionCombos(race: string): { ingRace1: string; ingRace2: string; }[] {
    return this.reverseFusionChart[race];
  }

  getForwardFusionCombos(race: string): { ingRace2: string, resultRace: string }[] {
    const combos = [];

    for (const [ingRace2, resultRace] of Object.entries(this.forwardFusionChart[race])) {
      if (ingRace2 !== race) {
        combos.push({ ingRace2, resultRace });
      }
    }

    return combos;
  }

  getFusionResultRace(ingRace1: string, ingRace2: string) {
    return this.forwardFusionChart[ingRace1][ingRace2];
  }

  getElementModifiers(race: string): { [offset: number]: string[] } {
    const modifiers = {};
    const raceModifiers = this.elementModifiers[race];

    for (const [element, offset] of Object.entries(raceModifiers)) {
      if (!modifiers.hasOwnProperty(offset)) {
        modifiers[offset] = [];
      }

      modifiers[offset].push(element);
    }

    return modifiers;
  }

  getElementResults(element: string): { [race: string]: number } {
    const results = {};

    for (const race of Races) {
      results[race] = this.elementModifiers[race][element];
    }

    return results;
  }
}
