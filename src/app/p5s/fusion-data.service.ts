import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { NormalFusionCalculator } from '../compendium/models/normal-fusion-calculator';
import { TripleFusionCalculator } from '../compendium/models/triple-fusion-calculator';
import { FusionTrioService as IFusionTrioService } from '../compendium/models';
import { splitWithSameRace, fuseWithSameRace, splitWithDiffRace, fuseWithDiffRace } from '../compendium/fusions/p5s-nonelem-fusions';
import { COMPENDIUM_CONFIG } from '../compendium/constants';
import { CompendiumConfig } from './models';
import { FusionSettings } from '../compendium/models/fusion-settings';

@Injectable()
export class FusionDataService implements IFusionTrioService {
  fissionCalculator = new NormalFusionCalculator([splitWithSameRace], [ ]);
  fusionCalculator = new NormalFusionCalculator([fuseWithSameRace], [ ]);
  triFissionCalculator = new TripleFusionCalculator([splitWithDiffRace], [ ]);
  triFusionCalculator = new TripleFusionCalculator([fuseWithDiffRace], [ ]);
  lang = 'en';

  compConfig: CompendiumConfig;
  appName: string;
  fusionSettings: Observable<FusionSettings>;

  private _compendium: Compendium;
  private _compendium$: BehaviorSubject<Compendium>;
  compendium: Observable<Compendium>;

  private _fusionChart: FusionChart;
  private _fusionChart$: BehaviorSubject<FusionChart>;
  fusionChart: Observable<FusionChart>;

  private _squareChart$: BehaviorSubject<{ normalChart: FusionChart, tripleChart: FusionChart }>;
  squareChart: Observable<{ normalChart: FusionChart, tripleChart: FusionChart }>;

  constructor(@Inject(COMPENDIUM_CONFIG) compConfig: CompendiumConfig) {
    this.appName = compConfig.appTitle + ' Fusion Calculator';
    this.compConfig = compConfig;

    this._compendium = new Compendium(compConfig);
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();

    this._fusionChart = new FusionChart(this.compConfig.races);
    this._fusionChart$ = new BehaviorSubject(this._fusionChart);
    this.fusionChart = this._fusionChart$.asObservable();

    this._squareChart$ = new BehaviorSubject({
      normalChart: this._fusionChart,
      tripleChart: this._fusionChart,
    });
    this.squareChart = this._squareChart$.asObservable();
  }

  updateFusionSettings(dlcDemons: { [name: string]: boolean }) { }
}
