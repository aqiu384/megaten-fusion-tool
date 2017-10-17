import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { FUSION_SETTINGS_KEY, FUSION_SETTINGS_VERSION } from './constants';
import { Compendium } from './models/compendium';
import { FusionChart } from '../persona/models/fusion-chart';
import { FusionTrioService as IFusionTrioService, SquareChart } from '../compendium/models';
import { Races, P3_NORMAL_FISSION_CALCULATOR, P3_NORMAL_FUSION_CALCULATOR } from './constants';

import * as DEMON_DATA_JSON from './data/demon-data.json';
import * as FUSION_CHART_JSON from './data/fusion-chart.json';
import * as GOLDEN_DEMON_DATA_JSON from './data/golden-demon-data.json';
import * as GOLDEN_FUSION_CHART_JSON from './data/golden-fusion-chart.json';

@Injectable()
export class FusionDataService implements IFusionTrioService {
  fissionCalculator = P3_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = P3_NORMAL_FUSION_CALCULATOR;
  appName = 'Persona 4';

  private _compendium: Compendium;
  private _compendium$: BehaviorSubject<Compendium>;
  compendium: Observable<Compendium>;

  private _fusionChart: FusionChart;
  private _fusionChart$: BehaviorSubject<FusionChart>;
  fusionChart: Observable<FusionChart>;

  private _tripleChart: FusionChart;
  private _squareChart$: BehaviorSubject<SquareChart>;
  squareChart: Observable<SquareChart>;

  constructor(private router: Router) {
    const game = router.url.split('/')[1];

    const demonData = [DEMON_DATA_JSON];
    let fusionChart = FUSION_CHART_JSON;
    let races = Races.slice(0, Races.length - 3);

    if (game === 'p4g') {
      demonData.push(GOLDEN_DEMON_DATA_JSON);
      fusionChart = GOLDEN_FUSION_CHART_JSON;
      races = Races.slice(0, Races.length - 1);
      this.appName = 'Persona 4 Golden';
    }

    this._compendium = new Compendium(demonData);
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();

    this._fusionChart = new FusionChart(fusionChart, races);
    this._fusionChart$ = new BehaviorSubject(this._fusionChart);
    this.fusionChart = this._fusionChart$.asObservable();

    this._tripleChart = new FusionChart(fusionChart, races, true);
    this._squareChart$ = new BehaviorSubject({ normalChart: this._fusionChart, tripleChart: this._tripleChart });
    this.squareChart = this._squareChart$.asObservable();
  }

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) { }
}
