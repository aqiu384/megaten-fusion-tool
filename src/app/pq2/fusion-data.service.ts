import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

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
import { CompendiumConfig, CompendiumConfigSet } from './models';

import { fuseWithDiffRace, fuseWithElement } from '../compendium/fusions/smt-nonelem-fusions';
import { fuseWithSameRace } from '../compendium/fusions/per-nonelem-fusions';
import { fuseWithNormResult, fuseWithSpecResult } from '../compendium/fusions/smt-element-fusions';
import { fuseTwoElements } from '../compendium/fusions/per-element-fusions';
import { splitWithDiffRace } from '../compendium/fusions/smt-nonelem-fissions';
import { splitWithSameRace } from '../compendium/fusions/per-nonelem-fissions';

import { NormalFusionCalculator } from '../compendium/models/normal-fusion-calculator';
import { ConfigurableFusionDataService } from '../compendium/bases/configurable-fusion-data.service';
import { FusionSettings } from '../compendium/models/fusion-settings';
import { translateCompConfig } from './models/translator';

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

  constructor(@Inject(COMPENDIUM_CONFIG) compConfigSet: CompendiumConfigSet, router: Router) {
    const parts = router.url.split('/');
    const defaultGame = Object.keys(compConfigSet.configs)[0];
    const enCompConfig =
      compConfigSet.configs[parts[2] || parts[1]] ||
      compConfigSet.configs[parts[1]] ||
      compConfigSet.configs[defaultGame];
    const lang = enCompConfig.translations.en.includes(parts[1]) ? parts[1] : 'en';

    const compConfig = lang === 'en' ? enCompConfig : translateCompConfig(enCompConfig, lang);
    const fusionChart = new PersonaFusionChart(compConfig.normalTable, compConfig.elementTable);
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

    this._tripleChart = new PersonaFusionChart(compConfig.normalTable, compConfig.elementTable, true);
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

    if (compConfig.appCssClasses.includes('p5')) {
      this.fissionCalculator = new NormalFusionCalculator([splitWithDiffRace, splitWithSameRace], []);
      this.fusionCalculator = new NormalFusionCalculator(
        [fuseWithDiffRace, fuseWithSameRace, fuseWithElement],
        [fuseWithNormResult, fuseWithSpecResult, fuseTwoElements]
      );
    }
  }
}
