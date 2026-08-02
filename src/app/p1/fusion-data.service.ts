import { Injectable, Inject, InjectionToken, Signal, WritableSignal, signal } from '@angular/core';
import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { FusionDataService as IFusionDataService } from '../compendium/models';
import { SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../compendium/constants';
import { FusionSettings } from '../compendium/models/fusion-settings';
import { CompendiumConfig } from './models';

export const COMPENDIUM_CONFIG = new InjectionToken<CompendiumConfig>('compendium.config');

@Injectable()
export class FusionDataService implements IFusionDataService {
  fissionCalculator = SMT_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = SMT_NORMAL_FUSION_CALCULATOR;
  settingsKey = 'p1-fusion-tool-settings';
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

  constructor(@Inject(COMPENDIUM_CONFIG) compConfig: CompendiumConfig) {
    this._compendium = new Compendium(compConfig);
    this._compendium$ = signal(this._compendium);
    this.compendium$ = this._compendium$.asReadonly();

    this._fusionChart = new FusionChart(compConfig);
    this._fusionChart$ = signal(this._fusionChart);
    this.fusionChart$ = this._fusionChart$.asReadonly();

    this.compConfig = compConfig;
    this.appName = compConfig.appTitle + ' Fusion Calculator';
  }

  updateFusionSettings(dlcDemons: { [name: string]: boolean }) { }
}
