import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { FUSION_SETTINGS_KEY, FUSION_SETTINGS_VERSION } from './constants';
import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { FusionDataService as IFusionDataService } from '../compendium/models';

import { SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../compendium/constants';

@Injectable()
export class FusionDataService implements IFusionDataService {
  fissionCalculator = SMT_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = SMT_NORMAL_FUSION_CALCULATOR;

  private _compendium = new Compendium();
  private _compendium$ = new BehaviorSubject(this._compendium);
  compendium = this._compendium$.asObservable();

  private _fusionChart = new FusionChart();
  private _fusionChart$ = new BehaviorSubject(this._fusionChart);
  fusionChart = this._fusionChart$.asObservable();

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) { }
}
