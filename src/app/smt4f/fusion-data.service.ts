import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { FusionDataService as IFusionDataService } from '../compendium/models';
import { COMPENDIUM_CONFIG, SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../compendium/constants';
import { CompendiumConfig } from './models';

@Injectable()
export class FusionDataService implements IFusionDataService {
  fissionCalculator = SMT_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = SMT_NORMAL_FUSION_CALCULATOR;
  compConfig: CompendiumConfig;
  appName: string;

  private _compendium: Compendium;
  private _compendium$: BehaviorSubject<Compendium>;
  compendium: Observable<Compendium>;

  private _fusionChart: FusionChart;
  private _fusionChart$: BehaviorSubject<FusionChart>;
  fusionChart: Observable<FusionChart>;

  constructor(@Inject(COMPENDIUM_CONFIG) compConfig: CompendiumConfig) {
    this.compConfig = compConfig;
    this.appName = compConfig.appTitle + ' Fusion Calculator';

    this._compendium = new Compendium(compConfig);
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();

    this._fusionChart = new FusionChart(compConfig);
    this._fusionChart$ = new BehaviorSubject(this._fusionChart);
    this.fusionChart = this._fusionChart$.asObservable();

    const settings = JSON.parse(localStorage.getItem(compConfig.settingsKey));

    if (settings && settings.version && settings.version >= compConfig.settingsVersion) {
      this.nextDlcDemons(settings.dlcDemons);
    }

    window.addEventListener('storage', this.onStorageUpdated.bind(this));
  }

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) {
    localStorage.setItem(this.compConfig.settingsKey, JSON.stringify({ version: this.compConfig.settingsVersion, dlcDemons }));
    this._compendium.dlcDemons = dlcDemons;
    this._compendium$.next(this._compendium);
  }

  onStorageUpdated(e) {
    switch (e.key) {
      case this.compConfig.settingsKey:
        this._compendium.dlcDemons = JSON.parse(e.newValue).dlcDemons;
        this._compendium$.next(this._compendium);
        break;
      default:
        break;
    }
  }
}
