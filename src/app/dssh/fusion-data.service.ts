import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { RaceOrder, FUSION_SETTINGS_KEY, FUSION_SETTINGS_VERSION } from './constants';
import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { FusionTrioService as IFusionTrioService } from '../compendium/models';

import { TripleFusionCalculator } from '../compendium/models/triple-fusion-calculator';
import { SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../compendium/constants';

import { splitWithDiffRace as splitDR, splitWithElementPair } from '../compendium/fusions/per-triple-fissions';
import { splitWithDiffRace, splitWithSameRace } from '../compendium/fusions/tri-element-fissions';
import { fuseInElementPair } from '../compendium/fusions/tri-element-fusions';
import {
  fuseT1WithDiffRace,
  fuseN1WithDiffRace,
  fuseWithSameRace,
  fuseWithElementPair
} from '../compendium/fusions/per-triple-fusions';

@Injectable()
export class FusionDataService implements IFusionTrioService {
  fissionCalculator = SMT_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = SMT_NORMAL_FUSION_CALCULATOR;
  triFissionCalculator = new TripleFusionCalculator(
    [ splitDR, splitWithElementPair ],
    [ splitWithDiffRace, splitWithSameRace ]
  );
  triFusionCalculator = new TripleFusionCalculator(
    [ fuseN1WithDiffRace, fuseT1WithDiffRace, fuseWithSameRace, fuseWithElementPair ],
    [ fuseInElementPair ]
  );

  private _compendium = new Compendium();
  private _compendium$ = new BehaviorSubject(this._compendium);
  compendium = this._compendium$.asObservable();

  private _fusionChart = new FusionChart();
  private _fusionChart$ = new BehaviorSubject(this._fusionChart);
  fusionChart = this._fusionChart$.asObservable();

  private _tripleChart = new FusionChart(true);
  private _squareChart$ = new BehaviorSubject({
    normalChart: this._fusionChart,
    tripleChart: this._tripleChart,
    raceOrder: RaceOrder
  });

  squareChart = this._squareChart$.asObservable();

  constructor() {
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
