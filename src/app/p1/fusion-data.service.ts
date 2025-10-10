import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { FusionDataService as IFusionDataService } from '../compendium/models';
import { COMPENDIUM_CONFIG, SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../compendium/constants';
import { FusionSettings } from '../compendium/models/fusion-settings';
import { CompendiumConfig } from './models';

@Injectable()
export class FusionDataService implements IFusionDataService {
  fissionCalculator = SMT_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = SMT_NORMAL_FUSION_CALCULATOR;
  settingsKey = 'p1-fusion-tool-settings';
  lang = 'en';

  compConfig: CompendiumConfig;
  appName: string;
  fusionSettings: Observable<FusionSettings>;

  private _compendium: Compendium;
  private _compendium$: BehaviorSubject<Compendium>;
  compendium: Observable<Compendium>;

  private _fusionChart: FusionChart;
  private _fusionChart$: BehaviorSubject<FusionChart>;
  fusionChart: Observable<FusionChart>;

  constructor(@Inject(COMPENDIUM_CONFIG) compConfig: CompendiumConfig) {
    this._compendium = new Compendium(compConfig);
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();

    this._fusionChart = new FusionChart(compConfig);
    this._fusionChart$ = new BehaviorSubject(this._fusionChart);
    this.fusionChart = this._fusionChart$.asObservable();

    this.compConfig = compConfig;
    this.appName = compConfig.appTitle + ' Fusion Calculator';
  }

  updateFusionSettings(dlcDemons: { [name: string]: boolean }) { }
}
