import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Compendium } from './models/compendium';
import { PersonaFusionChart } from '../compendium/models/per-fusion-chart';
import { FusionTrioService as IFusionTrioService } from '../compendium/models';
import { 
  COMPENDIUM_CONFIG,
  P3_NORMAL_FISSION_CALCULATOR,
  P3_NORMAL_FUSION_CALCULATOR,
  P3_TRIPLE_FISSION_CALCULATOR,
  P3_TRIPLE_FUSION_CALCULATOR 
} from '../compendium/constants';
import { CompendiumConfig } from './models';

import { NormalFusionCalculator } from '../compendium/models/normal-fusion-calculator';
import { fuseWithDiffRace } from '../compendium/fusions/smt-nonelem-fusions';
import { splitWithDiffRace } from '../compendium/fusions/smt-nonelem-fissions';
import { ConfigurableFusionDataService } from '../compendium/bases/configurable-fusion-data.service';
import { FusionSettings } from '../compendium/models/fusion-settings';

@Injectable()
export class FusionDataService extends ConfigurableFusionDataService<Compendium, PersonaFusionChart> implements IFusionTrioService {
  fissionCalculator = P3_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = P3_NORMAL_FUSION_CALCULATOR;
  triFissionCalculator = P3_TRIPLE_FISSION_CALCULATOR;
  triFusionCalculator = P3_TRIPLE_FUSION_CALCULATOR;

  compConfig: CompendiumConfig;
  appName: string;

  private _tripleChart: PersonaFusionChart;
  private _squareChart$: BehaviorSubject<{ normalChart: PersonaFusionChart, tripleChart: PersonaFusionChart, raceOrder }>;
  squareChart: Observable<{ normalChart: PersonaFusionChart, tripleChart: PersonaFusionChart, raceOrder }>;

  constructor(@Inject(COMPENDIUM_CONFIG) compConfig: CompendiumConfig) {
    const fusionChart = new PersonaFusionChart(compConfig.normalTable, compConfig.races);
    const fusionSettings = new FusionSettings(compConfig.demonUnlocks, []);

    super(
      new Compendium(compConfig, fusionSettings.demonToggles),
      fusionChart,
      fusionSettings,
      compConfig.settingsKey,
      compConfig.settingsVersion
    );

    this.compConfig = compConfig;
    this.appName = compConfig.appTitle + ' Fusion Calculator';

    this._tripleChart = new PersonaFusionChart(compConfig.normalTable, compConfig.races, true);
    this._squareChart$ = new BehaviorSubject({
      normalChart: fusionChart,
      tripleChart: this._tripleChart,
      raceOrder: compConfig.raceOrder
    });
    this.squareChart = this._squareChart$.asObservable();

    if (compConfig.appCssClasses.includes('p5t')) {
      this.fissionCalculator = new NormalFusionCalculator([splitWithDiffRace], []);
      this.fusionCalculator = new NormalFusionCalculator([fuseWithDiffRace], []);
    }
  }
}
