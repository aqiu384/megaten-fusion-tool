import { Injectable, Inject } from '@angular/core';

import { Compendium } from './models/compendium';
import { FusionChart } from './models/fusion-chart';

import { COMPENDIUM_CONFIG } from '../compendium/constants';
import { CompendiumConfig } from './models';

import { NormalFusionCalculator } from '../compendium/models/normal-fusion-calculator';
import { ConfigurableFusionDataService } from '../compendium/bases/configurable-fusion-data.service';

import { fuseWithDiffRace, fuseWithElement } from '../compendium/fusions/smt-nonelem-fusions';
import { fuseWithSameRace } from '../compendium/fusions/per-nonelem-fusions';
import { fuseWithNormResult, fuseWithSpecResult } from '../compendium/fusions/smt-element-fusions';
import { fuseTwoElements } from '../compendium/fusions/per-element-fusions';

import { splitWithDiffRace, splitWithElement } from '../compendium/fusions/smt-nonelem-fissions';
import { splitWithSameRace } from '../compendium/fusions/per-nonelem-fissions';
import { FusionSettings } from '../compendium/models/fusion-settings';

@Injectable()
export class FusionDataService extends ConfigurableFusionDataService<Compendium, FusionChart> {
  fissionCalculator = new NormalFusionCalculator(
    [ splitWithDiffRace, splitWithSameRace, splitWithElement ],
    [ ]
  );

  fusionCalculator = new NormalFusionCalculator(
    [ fuseWithDiffRace, fuseWithSameRace, fuseWithElement ],
    [ fuseWithNormResult, fuseWithSpecResult, fuseTwoElements ]
  );

  compConfig: CompendiumConfig;
  appName: string;

  constructor(@Inject(COMPENDIUM_CONFIG) compConfig: CompendiumConfig) {
    const fusionSettings = new FusionSettings(compConfig.demonUnlocks, []);

    super(
      new Compendium(compConfig, fusionSettings.demonToggles),
      new FusionChart(compConfig.normalTable, compConfig.elementTable),
      fusionSettings,
      compConfig.settingsKey,
      compConfig.settingsVersion
    );

    this.compConfig = compConfig;
    this.appName = compConfig.appTitle + ' Fusion Calculator';
  }
}
