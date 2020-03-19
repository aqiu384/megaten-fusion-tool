import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { FUSION_SETTINGS_KEY, FUSION_SETTINGS_VERSION } from './models/constants';
import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { FusionDataService as IFusionDataService } from '../compendium/models';
import { SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../compendium/constants';

@Injectable()
export class FusionDataService implements IFusionDataService {
  fissionCalculator = SMT_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = SMT_NORMAL_FUSION_CALCULATOR;
  appName = 'Shin Megami tensei III: Nocturne Fusion Calculator';

  private _compendium = new Compendium();
  private _compendium$ = new BehaviorSubject(this._compendium);
  compendium = this._compendium$.asObservable();

  private _fusionChart = new FusionChart();
  private _fusionChart$ = new BehaviorSubject(this._fusionChart);
  fusionChart = this._fusionChart$.asObservable();

  constructor() {
    const settings = JSON.parse(localStorage.getItem(FUSION_SETTINGS_KEY));

    if (settings && settings.version && settings.version >= FUSION_SETTINGS_VERSION) {
      this.nextChartSettings(settings.chartSettings);
    }

    window.addEventListener('storage', this.onStorageUpdated.bind(this));
  }

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) { }

  nextChartSettings(chartSettings: { [name: string]: boolean }) {
    localStorage.setItem(FUSION_SETTINGS_KEY, JSON.stringify({ version: FUSION_SETTINGS_VERSION, chartSettings }));
    this._fusionChart.chartSettings = chartSettings;
    this._fusionChart$.next(this._fusionChart);
  }

  onStorageUpdated(e) {
    switch (e.key) {
      case FUSION_SETTINGS_KEY:
        this._fusionChart.chartSettings = JSON.parse(e.newValue).chartSettings;
        this._fusionChart$.next(this._fusionChart);
        break;
      default:
        break;
    }
  }
}
