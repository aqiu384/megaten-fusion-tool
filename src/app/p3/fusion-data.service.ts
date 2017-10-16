import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { FUSION_SETTINGS_KEY, FUSION_SETTINGS_VERSION } from './constants';
import { Compendium } from './models/compendium';
import { FusionChart } from '../persona/models/fusion-chart';
import { FusionTrioService as IFusionTrioService, SquareChart } from '../compendium/models';
import { Races, P3_NORMAL_FISSION_CALCULATOR, P3_NORMAL_FUSION_CALCULATOR } from './constants';

import * as FUSION_CHART_JSON from './data/fusion-chart.json';

@Injectable()
export class FusionDataService implements IFusionTrioService {
  fissionCalculator = P3_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = P3_NORMAL_FUSION_CALCULATOR;

  private _compendium = new Compendium();
  private _compendium$ = new BehaviorSubject(this._compendium);
  compendium = this._compendium$.asObservable();

  private _fusionChart = new FusionChart(FUSION_CHART_JSON, Races);
  private _fusionChart$ = new BehaviorSubject(this._fusionChart);
  fusionChart = this._fusionChart$.asObservable();

  private _tripleChart = new FusionChart(FUSION_CHART_JSON, Races, true);
  private _squareChart$ = new BehaviorSubject({ normalChart: this._fusionChart, tripleChart: this._tripleChart });
  squareChart = this._squareChart$.asObservable();

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) { }
}
