import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { FUSION_SETTINGS_KEY, FUSION_SETTINGS_VERSION } from './constants';
import { Compendium } from './models/compendium';
import { PersonaFusionChart } from '../compendium/models/per-fusion-chart';
import { FusionTrioService as IFusionTrioService, SquareChart } from '../compendium/models';
import { Races, RaceOrder, P3_NORMAL_FISSION_CALCULATOR, P3_NORMAL_FUSION_CALCULATOR } from './constants';
import { P3_TRIPLE_FISSION_CALCULATOR, P3_TRIPLE_FUSION_CALCULATOR } from '../compendium/constants';

import * as FES_DEMON_DATA_JSON from './data/fes-demon-data.json';
import * as P3P_DEMON_DATA_JSON from './data/p3p-demon-data.json';
import * as FUSION_CHART_JSON from './data/fusion-chart.json';

@Injectable()
export class FusionDataService implements IFusionTrioService {
  fissionCalculator = P3_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = P3_NORMAL_FUSION_CALCULATOR;
  triFissionCalculator = P3_TRIPLE_FISSION_CALCULATOR;
  triFusionCalculator = P3_TRIPLE_FUSION_CALCULATOR;
  appName = 'Persona 3 FES';

  private _compendium: Compendium;
  private _compendium$: BehaviorSubject<Compendium>;
  compendium: Observable<Compendium>;

  private _fusionChart = new PersonaFusionChart(FUSION_CHART_JSON, Races);
  private _fusionChart$ = new BehaviorSubject(this._fusionChart);
  fusionChart = this._fusionChart$.asObservable();

  private _tripleChart = new PersonaFusionChart(FUSION_CHART_JSON, Races, true);
  private _squareChart$ = new BehaviorSubject({
    normalChart: this._fusionChart,
    tripleChart: this._tripleChart,
    raceOrder: RaceOrder
  });

  squareChart = this._squareChart$.asObservable();

  constructor(private router: Router) {
    const game = router.url.split('/')[1];
    const demonDataJsons = [FES_DEMON_DATA_JSON];

    if (game === 'p3p') {
      demonDataJsons.push(P3P_DEMON_DATA_JSON);
      this.appName = 'Persona 3 Portable';
    }

    this._compendium = new Compendium(demonDataJsons);
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();
  }

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) { }
}
