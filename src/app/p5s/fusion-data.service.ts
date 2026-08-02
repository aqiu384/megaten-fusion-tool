import { Injectable, Inject, InjectionToken, Signal, WritableSignal, signal } from '@angular/core';
import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { NormalFusionCalculator } from '../compendium/models/normal-fusion-calculator';
import { TripleFusionCalculator } from '../compendium/models/triple-fusion-calculator';
import { FusionTrioService as IFusionTrioService } from '../compendium/models';
import { splitWithSameRace, fuseWithSameRace, splitWithDiffRace, fuseWithDiffRace } from '../compendium/fusions/p5s-nonelem-fusions';
import { CompendiumConfig } from './models';
import { FusionSettings } from '../compendium/models/fusion-settings';

export const COMPENDIUM_CONFIG = new InjectionToken<CompendiumConfig>('compendium.config');

@Injectable()
export class FusionDataService implements IFusionTrioService {
  fissionCalculator = new NormalFusionCalculator([splitWithSameRace], [ ]);
  fusionCalculator = new NormalFusionCalculator([fuseWithSameRace], [ ]);
  triFissionCalculator = new TripleFusionCalculator([splitWithDiffRace], [ ]);
  triFusionCalculator = new TripleFusionCalculator([fuseWithDiffRace], [ ]);
  lang = 'en';

  compConfig: CompendiumConfig;
  appName: string;
  fusionSettings$: Signal<FusionSettings>;

  private _compendium: Compendium;
  private _compendium$: WritableSignal<Compendium>;
  compendium$: Signal<Compendium>;

  private _fusionChart: FusionChart;
  private _fusionChart$: WritableSignal<FusionChart>;
  fusionChart$: Signal<FusionChart>;

  private _squareChart$: WritableSignal<{ normalChart: FusionChart, tripleChart: FusionChart }>;
  squareChart$: Signal<{ normalChart: FusionChart, tripleChart: FusionChart }>;

  constructor(@Inject(COMPENDIUM_CONFIG) compConfig: CompendiumConfig) {
    this.appName = compConfig.appTitle + ' Fusion Calculator';
    this.compConfig = compConfig;

    this._compendium = new Compendium(compConfig);
    this._compendium$ = signal(this._compendium);
    this.compendium$ = this._compendium$.asReadonly();

    this._fusionChart = new FusionChart(this.compConfig.races);
    this._fusionChart$ = signal(this._fusionChart);
    this.fusionChart$ = this._fusionChart$.asReadonly();

    this._squareChart$ = signal({
      normalChart: this._fusionChart,
      tripleChart: this._fusionChart,
    });
    this.squareChart$ = this._squareChart$.asReadonly();
  }

  updateFusionSettings(dlcDemons: { [name: string]: boolean }) { }
}
