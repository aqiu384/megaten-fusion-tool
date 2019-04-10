import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { FusionDataService as IFusionDataService } from '../compendium/models';
import { SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../compendium/constants';
import {
  VAN_FUSION_SETTINGS_KEY,
  DSJ_FUSION_SETTINGS_KEY,
  FUSION_SETTINGS_VERSION
} from './models/constants';

@Injectable()
export class FusionDataService implements IFusionDataService {
  fissionCalculator = SMT_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = SMT_NORMAL_FUSION_CALCULATOR;
  settingsKey = VAN_FUSION_SETTINGS_KEY;
  appName = 'Shin Megami Tensei: Strange Journey';
  isRedux = false;

  private _compendium: Compendium;
  private _compendium$: BehaviorSubject<Compendium>;
  compendium: Observable<Compendium>;

  private _fusionChart = new FusionChart();
  private _fusionChart$ = new BehaviorSubject(this._fusionChart);
  fusionChart = this._fusionChart$.asObservable();

  constructor(private router: Router) {
    const game = router.url.split('/')[1];

    this._compendium = new Compendium(game === 'smtdsj');
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();

    if (game === 'smtdsj') {
      this.settingsKey = DSJ_FUSION_SETTINGS_KEY;
      this.appName = 'Shin Megami Tensei: Strange Journey Redux';
      this.isRedux = true;
    }

    const settings = JSON.parse(localStorage.getItem(this.settingsKey));

    if (settings && settings.version && settings.version >= FUSION_SETTINGS_VERSION) {
      this.nextIncludedSubapps(settings.subapps);
    }

    window.addEventListener('storage', this.onStorageUpdated.bind(this));
  }

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) { }

  nextIncludedSubapps(subapps: { [name: string]: boolean }) {
    localStorage.setItem(this.settingsKey, JSON.stringify({ version: FUSION_SETTINGS_VERSION, subapps }));
    this._fusionChart.includedSubapps = subapps;
    this._fusionChart$.next(this._fusionChart);
  }

  onStorageUpdated(e) {
    switch (e.key) {
      case this.settingsKey:
        this._fusionChart.includedSubapps = JSON.parse(e.newValue).subapps;
        this._fusionChart$.next(this._fusionChart);
        break;
      default:
        break;
    }
  }
}
