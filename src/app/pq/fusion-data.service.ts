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

import * as DEMON_DATA_JSON from './data/demon-data.json';
import * as FUSION_CHART_JSON from './data/fusion-chart.json';

@Injectable()
export class FusionDataService implements IFusionTrioService {
  fissionCalculator = P3_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = P3_NORMAL_FUSION_CALCULATOR;
  triFissionCalculator = P3_TRIPLE_FISSION_CALCULATOR;
  triFusionCalculator = P3_TRIPLE_FUSION_CALCULATOR;

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

  constructor() {
    const demonDataJsons = [DEMON_DATA_JSON];

    this._compendium = new Compendium(demonDataJsons);
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();

    const settings = JSON.parse(localStorage.getItem(FUSION_SETTINGS_KEY));

    if (settings && settings.version && settings.version >= FUSION_SETTINGS_VERSION) {
      this.nextDlcDemons(settings.dlcDemons);
    }

    window.addEventListener('storage', this.onStorageUpdated.bind(this));
  }

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) {
    localStorage.setItem(FUSION_SETTINGS_KEY, JSON.stringify({ version: FUSION_SETTINGS_VERSION, dlcDemons }));
    this._compendium.dlcDemons = dlcDemons;
    this._compendium$.next(this._compendium);
  }

  onStorageUpdated(e) {
    switch (e.key) {
      case FUSION_SETTINGS_KEY:
        this._compendium.dlcDemons = JSON.parse(e.newValue).dlcDemons;
        this._compendium$.next(this._compendium);
        break;
      default:
        break;
    }
  }
}
