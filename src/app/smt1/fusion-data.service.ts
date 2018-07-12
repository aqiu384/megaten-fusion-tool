import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { SpeciesFusionChart } from './models/species-fusion-chart';
import { CompendiumConfig } from './models';

import { FusionTrioService as IFusionTrioService, SquareChart } from '../compendium/models';
import { TripleFusionCalculator } from '../compendium/models/triple-fusion-calculator';
import { SMT_NORMAL_FUSION_CALCULATOR, SMT_NORMAL_FISSION_CALCULATOR } from '../compendium/constants';

import { splitWithDiffRace as splitTripleDR } from '../compendium/fusions/per-triple-fissions';
import { fuseT1WithDiffRace, fuseN1WithDiffRace } from '../compendium/fusions/per-triple-fusions';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FusionDataService implements IFusionTrioService {
  fusionCalculator = SMT_NORMAL_FUSION_CALCULATOR;
  fissionCalculator = SMT_NORMAL_FISSION_CALCULATOR;
  triFusionCalculator = new TripleFusionCalculator(
    [fuseN1WithDiffRace, fuseT1WithDiffRace],
    []
  );
  triFissionCalculator = new TripleFusionCalculator(
    [splitTripleDR],
    []
  );

  compConfig: CompendiumConfig;
  appName: string;

  compendium: Observable<Compendium>;
  fusionChart: Observable<FusionChart>
  squareChart: Observable<SquareChart>;

  constructor(compConfig: CompendiumConfig) {
    this.compConfig = compConfig;
    this.appName = compConfig.appTitle;

    const tripleChart = new SpeciesFusionChart(compConfig);

    this.compendium = new BehaviorSubject(new Compendium(compConfig)).asObservable();
    this.fusionChart = new BehaviorSubject(new FusionChart(compConfig)).asObservable();
    this.squareChart = new BehaviorSubject({ 
      tripleChart,
      normalChart: tripleChart,
      raceOrder: compConfig.raceOrder
    }).asObservable();
  }

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) { return {}; }
}
