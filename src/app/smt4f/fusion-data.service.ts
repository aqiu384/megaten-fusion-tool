import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { translateCompConfig } from './models/translator';
import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';
import { COMPENDIUM_CONFIG, SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../compendium/constants';
import { ConfigurableFusionDataService } from '../compendium/bases/configurable-fusion-data.service';
import { CompendiumConfig } from './models';
import { FusionSettings } from '../compendium/models/fusion-settings';
import { translateComp } from '../compendium/models/translator';
import Translations from  '../compendium/data/translations.json';

@Injectable()
export class FusionDataService extends ConfigurableFusionDataService<Compendium, FusionChart> {
  fissionCalculator = SMT_NORMAL_FISSION_CALCULATOR;
  fusionCalculator = SMT_NORMAL_FUSION_CALCULATOR;
  compConfig: CompendiumConfig;
  appName: string;

  constructor(@Inject(COMPENDIUM_CONFIG) config: CompendiumConfig, router: Router) {
    const parts = router.url.split('/');
    const lang = config.translations.en.includes(parts[1]) ? parts[1] : 'en';
    const compConfig = lang === 'en' ? config : translateCompConfig(config, lang);
    const fusionSettings = new FusionSettings(compConfig.demonUnlocks, []);

    super(
      new Compendium(compConfig, fusionSettings.demonToggles),
      new FusionChart(compConfig),
      fusionSettings,
      compConfig.settingsKey,
      compConfig.settingsVersion
    );
    
    this.compConfig = compConfig;
    this.appName =  this.compConfig.appTitle + translateComp(Translations.CompendiumComponent.FusionCalculator, compConfig.lang);
  }
}
