import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { RaceOrder } from './constants';
import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { SpeciesFusionChart } from './models/species-fusion-chart';

import { FusionTrioService as IFusionTrioService, SquareChart } from '../compendium/models';
import { TripleFusionCalculator } from '../compendium/models/triple-fusion-calculator';
import { SMT_NORMAL_FUSION_CALCULATOR, SMT_NORMAL_FISSION_CALCULATOR } from '../compendium/constants';

import { splitWithDiffRace as splitTripleDR } from '../compendium/fusions/per-triple-fissions';
import { fuseT1WithDiffRace, fuseN1WithDiffRace } from '../compendium/fusions/per-triple-fusions';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FusionDataService implements IFusionTrioService {
  fusionCalculator = SMT_NORMAL_FUSION_CALCULATOR;
  fissionCalculator = SMT_NORMAL_FISSION_CALCULATOR;
  triFusionCalculator = new TripleFusionCalculator(
    [fuseN1WithDiffRace, fuseT1WithDiffRace],
    []
  );
  triFissionCalculator = new TripleFusionCalculator(
    [],
    []
  );

  appName: string;

  private _compendium: Compendium;
  private _compendium$: BehaviorSubject<Compendium>;
  compendium: Observable<Compendium>;

  private _fusionChart: FusionChart;
  private _fusionChart$: BehaviorSubject<FusionChart>;
  fusionChart: Observable<FusionChart>

  private _tripleChart: SpeciesFusionChart;
  private _squareChart$: BehaviorSubject<SquareChart>;
  squareChart: Observable<SquareChart>;

  constructor(demonJson, skillJson, alignJson, normalJson, elementJson, appName: string) {
    this.appName = appName;

    this._compendium = new Compendium(demonJson, skillJson, alignJson);
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();

    this._fusionChart = new FusionChart(normalJson, elementJson, alignJson);
    this._fusionChart$ = new BehaviorSubject(this._fusionChart);
    this.fusionChart = this._fusionChart$.asObservable();

    this._tripleChart = new SpeciesFusionChart();
    this._squareChart$ = new BehaviorSubject({
      normalChart: this._tripleChart,
      tripleChart: this._tripleChart,
      raceOrder: RaceOrder
    });

    this.squareChart = this._squareChart$.asObservable();
  }

  nextDlcDemons(dlcDemons: { [name: string]: boolean }) { return {}; }
}
