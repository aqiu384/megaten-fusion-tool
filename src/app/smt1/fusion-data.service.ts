import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { SpeciesFusionChart } from './models/species-fusion-chart';
import { CompendiumConfig } from './models';

import { FusionTrioService as IFusionTrioService, SquareChart } from '../compendium/models';
import { TripleFusionCalculator } from '../compendium/models/triple-fusion-calculator';
import {
  SMT_NORMAL_FUSION_CALCULATOR,
  SMT_NES_NORMAL_FUSION_CALCULATOR,
  SMT_NORMAL_FISSION_CALCULATOR
} from '../compendium/constants';

import { splitWithDiffRace as splitTripleDR, splitWithElementPair } from '../compendium/fusions/per-triple-fissions';
import { fuseT1WithDiffRace, fuseN1WithDiffRace } from '../compendium/fusions/per-triple-fusions';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FusionDataService implements IFusionTrioService {
  fusionCalculator = SMT_NORMAL_FUSION_CALCULATOR;
  fissionCalculator = SMT_NORMAL_FISSION_CALCULATOR;
  triFusionCalculator: TripleFusionCalculator;
  triFissionCalculator: TripleFusionCalculator;

  compConfig: CompendiumConfig;
  appName: string;

  compendium: Observable<Compendium>;
  fusionChart: Observable<FusionChart>
  squareChart: Observable<SquareChart>;

  constructor(compConfig: CompendiumConfig) {
    this.compConfig = compConfig;
    this.appName = compConfig.appTitle;

    this.compendium = new BehaviorSubject(new Compendium(compConfig)).asObservable();

    const normalChart = new FusionChart(compConfig);
    let doubleChart, tripleChart;

    if (compConfig.useSpeciesFusion) {
      doubleChart = new SpeciesFusionChart(compConfig);
      tripleChart = doubleChart;
    } else {
      doubleChart = normalChart;
      tripleChart = new FusionChart(compConfig, true);
    }

    if (compConfig.darknessRecipes) {
      this.fusionCalculator = SMT_NES_NORMAL_FUSION_CALCULATOR;
    }

    this.triFusionCalculator = new TripleFusionCalculator(
      [fuseN1WithDiffRace, fuseT1WithDiffRace],
      []
    );
    this.triFissionCalculator = new TripleFusionCalculator(
      compConfig.tripleElementTable ?
        [splitTripleDR, splitWithElementPair] :
        [splitTripleDR],
      []
    );

    this.fusionChart = new BehaviorSubject(new FusionChart(compConfig)).asObservable();
    this.squareChart = new BehaviorSubject({ 
      normalChart: doubleChart,
      tripleChart,
      raceOrder: compConfig.raceOrder
    }).asObservable();
  }

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) { return {}; }
}
