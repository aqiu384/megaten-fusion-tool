import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { COMPENDIUM_CONFIG } from '../compendium/constants';
import { FusionDataService as IFusionDataService, FusionCalculator } from '../compendium/models';

import { CompendiumConfig } from './models'

@Injectable()
export class FusionDataService implements IFusionDataService {
  fissionCalculator: FusionCalculator;;
  fusionCalculator: FusionCalculator;
  compConfig: CompendiumConfig;
  appName: string;

  compendium: Observable<Compendium>;
  fusionChart: Observable<FusionChart>

  constructor(@Inject(COMPENDIUM_CONFIG) compConfig: CompendiumConfig) {
    this.fissionCalculator = compConfig.fissionCalculator;
    this.fusionCalculator = compConfig.fusionCalculator;
    this.compConfig = compConfig;
    this.appName = compConfig.appTitle + ' Fusion Calculator';

    this.compendium = new BehaviorSubject(new Compendium(compConfig)).asObservable();
    this.fusionChart = new BehaviorSubject(new FusionChart(compConfig)).asObservable();
  }

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) { return {}; }
}
