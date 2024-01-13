import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { Compendium } from './models/compendium';
import { PersonaFusionChart } from '../compendium/models/per-fusion-chart';
import { FusionTrioService as IFusionTrioService } from '../compendium/models';
import { 
  COMPENDIUM_CONFIG,
  P3_NORMAL_FISSION_CALCULATOR,
  P3_NORMAL_FUSION_CALCULATOR,
  P3_TRIPLE_FISSION_CALCULATOR,
  P3_TRIPLE_FUSION_CALCULATOR 
} from '../compendium/constants';
import { CompendiumConfig, CompendiumConfigSet } from './models';
import { FusionSettings } from '../compendium/models/fusion-settings';

@Injectable()
export class FusionDataService implements IFusionTrioService {
  fissionCalculator = P3_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = P3_NORMAL_FUSION_CALCULATOR;
  triFissionCalculator = P3_TRIPLE_FISSION_CALCULATOR;
  triFusionCalculator = P3_TRIPLE_FUSION_CALCULATOR;

  compConfig: CompendiumConfig;
  appName: string;
  fusionSettings: Observable<FusionSettings>;

  private _compendium: Compendium;
  private _compendium$: BehaviorSubject<Compendium>;
  compendium: Observable<Compendium>;

  private _fusionChart: PersonaFusionChart;
  private _fusionChart$: BehaviorSubject<PersonaFusionChart>;
  fusionChart: Observable<PersonaFusionChart>;

  private _tripleChart: PersonaFusionChart;
  private _squareChart$: BehaviorSubject<{ normalChart: PersonaFusionChart, tripleChart: PersonaFusionChart, raceOrder }>;
  squareChart: Observable<{ normalChart: PersonaFusionChart, tripleChart: PersonaFusionChart, raceOrder }>;

  constructor(@Inject(COMPENDIUM_CONFIG) compConfigSet: CompendiumConfigSet, router: Router) {
    const gameCand = router.url.split('/')[1];
    const gameAbbr = compConfigSet.configs[gameCand] ? gameCand : 'p4';

    this.compConfig = compConfigSet.configs[gameAbbr];
    this.appName = this.compConfig.appTitle + ' Fusion Calculator';

    this._compendium = new Compendium(this.compConfig);
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();

    this._fusionChart = new PersonaFusionChart(this.compConfig.normalTable, this.compConfig.races);
    this._fusionChart$ = new BehaviorSubject(this._fusionChart);
    this.fusionChart = this._fusionChart$.asObservable();

    this._tripleChart = new PersonaFusionChart(this.compConfig.normalTable, this.compConfig.races, true);
    this._squareChart$ = new BehaviorSubject({
      normalChart: this._fusionChart,
      tripleChart: this._tripleChart,
      raceOrder: this.compConfig.raceOrder
    });
    this.squareChart = this._squareChart$.asObservable();
  }

  updateFusionSettings(dlcDemons: { [name: string]: boolean }) { }
}
