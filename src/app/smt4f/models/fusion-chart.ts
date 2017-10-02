import { Races, ElementDemons, RaceOrder } from './constants';
import { FusionChart as IFusionChart } from '../../compendium/models';

import * as FUSION_CHART_JSON from '../data/fusion-chart.json';
import * as ELEMENT_MODIFIERS_JSON from '../data/element-modifiers.json';

export class FusionChart implements IFusionChart {
  forwardFusionChart: { [race1: string]: { [race2: string]: string } };
  reverseFusionChart: { [raceR: string]: { ingRace1: string, ingRace2: string }[] };
  elementModifiers: { [race: string]: { [element: string]: number } };
  lvlModifier = 0;

  constructor() {
    this.initImportedData();
  }

  initImportedData() {
    const forwardChart: { [race1: string]: { [race2: string]: string } } = {};
    const reverseChart: { [raceR: string]: { ingRace1: string, ingRace2: string }[] } = {};
    const elementModifiers: { [race: string]: { [element: string]: number } } = {};

    for (const race1 of Races) {
      forwardChart[race1] = {};
      reverseChart[race1] = [];
      elementModifiers[race1] = {};
    }

    for (const element of ElementDemons) {
      reverseChart[element] = [];
    }

    for (const [ingRace1, row] of Object.entries(FUSION_CHART_JSON)) {
      for (const [ingRace2, result] of Object.entries(row)) {
        reverseChart[result].push({ ingRace1, ingRace2 });
        forwardChart[ingRace1][ingRace2] = result;
        forwardChart[ingRace2][ingRace1] = result;
      }
    }

    for (const [race1, row] of Object.entries(ELEMENT_MODIFIERS_JSON)) {
      for (const [element, result] of Object.entries(row)) {
        elementModifiers[race1][element] = result;
      }
    }

    this.forwardFusionChart = forwardChart;
    this.reverseFusionChart = reverseChart;
    this.elementModifiers = elementModifiers;
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
    const modifiers = { 1: [], '-1': [] };

    for (const [element, offset] of Object.entries(this.elementModifiers[race])) {
      modifiers[offset].push(element);
    }

    return modifiers;
  }

  getElementResults(element: string): { [race: string]: number } {
    const results = {};
    let result;

    for (const race of Races) {
      if (result = this.elementModifiers[race][element]) {
        results[race] = result;
      }
    }

    return results;
  }
}
