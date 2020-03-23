import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

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

  constructor(@Inject(COMPENDIUM_CONFIG) compConfig: CompendiumConfig, router: Router) {
    const gameCand = router.url.split('/')[1];
    const game = compConfig.demonData[gameCand] ? gameCand : 'krch';

    this.appName = compConfig.gameTitles[game] + ' Fusion Calculator';
    this.fissionCalculator = compConfig.fissionCalculator;
    this.fusionCalculator = compConfig.fusionCalculator;
    this.compConfig = compConfig;

    this.compendium = new BehaviorSubject(new Compendium(compConfig, game)).asObservable();
    this.fusionChart = new BehaviorSubject(new FusionChart(compConfig)).asObservable();
  }

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) { return {}; }
}
