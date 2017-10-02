import { Races, RaceOrder, PrimeElements } from './constants';
import { FusionChart as IFusionChart } from '../../compendium/models';

import * as FUSION_CHART_JSON from '../data/fusion-chart.json';
import * as ELEMENT_MODIFIERS_JSON from '../data/element-modifiers.json';

export class FusionChart implements IFusionChart {
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
    'UMA Converter': true,
    'Fiend Converter': true,
    'Enigma Converter': true
  };

  includedSubapps: { [name: string]: boolean } = {};
  forwardFusionChart: { [race1: string]: { [race2: string]: string } };
  reverseFusionChart: { [raceR: string]: { ingRace1: string, ingRace2: string }[] };
  elementModifiers: { [race: string]: { [element: string]: number } };

  constructor() {
    this.initImportedData();
  }

  initImportedData() {
    const forwardChart: { [race1: string]: { [race2: string]: string } } = {};
    const reverseChart: { [raceR: string]: { ingRace1: string, ingRace2: string }[] } = {};
    const elementModifiers: { [race: string]: { [element: string]: number } } = {};

    for (const race1 of Races) {
      forwardChart[race1] = {};
    }

    for (const [ingRace1, row] of Object.entries(FUSION_CHART_JSON)) {
      for (const [ingRace2, result] of Object.entries(row)) {
        if (!reverseChart[result]) {
          reverseChart[result] = [];
        }

        reverseChart[result].push({ ingRace1, ingRace2 });
        forwardChart[ingRace1][ingRace2] = result;
        forwardChart[ingRace2][ingRace1] = result;
      }
    }

    for (const [fromRace, toRace] of Object.entries(FusionChart.RACE_CONVERTERS)) {
      reverseChart[toRace] = reverseChart[fromRace];
    }

    for (const [race, json] of Object.entries(ELEMENT_MODIFIERS_JSON)) {
      elementModifiers[race] = {};
      for (let i = 0; i < PrimeElements.length; i++) {
        elementModifiers[race][PrimeElements[i]] = json[i];
      }
    }

    this.forwardFusionChart = forwardChart;
    this.reverseFusionChart = reverseChart;
    this.elementModifiers = elementModifiers;
    this.includedSubapps = Object.assign({}, FusionChart.INCLUDED_SUBAPPS);
  }

  get lvlModifier(): number {
    return this.includedSubapps.Laplace ? 4 : 1;
  }

  getReverseFusionCombos(race: string): { ingRace1: string; ingRace2: string; }[] {
    if (this.isConvertedRace(race)) {
      if (this.isSubappOn(`${race} Converter`)) {
        return this.reverseFusionChart[FusionChart.INVERSE_RACE_CONVERTERS[race]];
      } else {
        return [];
      }
    } else {
      return this.reverseFusionChart[race];
    }
  }

  getForwardFusionCombos(race: string): { ingRace2: string, resultRace: string }[] {
    const combos = [];

    for (const [ingRace2, resultRace] of Object.entries(this.forwardFusionChart[race])) {
      if (ingRace2 !== race) {
        const convertedRace = FusionChart.RACE_CONVERTERS[resultRace];
        combos.push({ ingRace2, resultRace });

        if (convertedRace && this.isSubappOn(`${convertedRace} Converter`)) {
          combos.push({
            ingRace2,
            resultRace: FusionChart.RACE_CONVERTERS[resultRace]
          });
        }
      }
    }

    return combos;
  }

  getFusionResultRace(ingRace1: string, ingRace2: string) {
    return this.forwardFusionChart[ingRace1][ingRace2];
  }

  getElementModifiers(race: string): { [offset: number]: string[] } {
    if (!this.elementModifiers.hasOwnProperty(race)) {
      return {};
    }

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
      const currMods = this.elementModifiers[race];
      if (currMods) {
        results[race] = this.elementModifiers[race][element];
      }
    }

    return results;
  }

  isConvertedRace(race: string): boolean {
    return FusionChart.INVERSE_RACE_CONVERTERS.hasOwnProperty(race);
  }

  isSubappOn(subapp: string) {
    return this.includedSubapps.hasOwnProperty(subapp) && this.includedSubapps[subapp];
  }
}
