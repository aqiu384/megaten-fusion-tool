import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { COMPENDIUM_CONFIG } from '../compendium/constants';
import { FusionDataService as IFusionDataService, FusionCalculator } from '../compendium/models';

import { CompendiumConfig, CompendiumConfigSet } from './models'
import { FusionSettings } from '../compendium/models/fusion-settings';

@Injectable()
export class FusionDataService implements IFusionDataService {
  fissionCalculator: FusionCalculator;;
  fusionCalculator: FusionCalculator;
  compConfig: CompendiumConfig;
  appName: string;

  compendium: Observable<Compendium>;
  fusionChart: Observable<FusionChart>
  fusionSettings: Observable<FusionSettings>;

  constructor(@Inject(COMPENDIUM_CONFIG) compConfigSet: CompendiumConfigSet, router: Router) {
    const gameCand = router.url.split('/')[1];
    const gameAbbr = compConfigSet.configs[gameCand] ? gameCand : 'krch';

    this.compConfig = compConfigSet.configs[gameAbbr];
    this.appName = this.compConfig.appTitle + ' Fusion Calculator';
    this.fissionCalculator = this.compConfig.fissionCalculator;
    this.fusionCalculator = this.compConfig.fusionCalculator;

    this.compendium = new BehaviorSubject(new Compendium(this.compConfig)).asObservable();
    this.fusionChart = new BehaviorSubject(new FusionChart(this.compConfig)).asObservable();
  }

  updateFusionSettings(dlcDemons: { [name: string]: boolean }) { return {}; }
}
