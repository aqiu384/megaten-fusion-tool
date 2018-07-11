import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from './compendium-routing.module';
import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { CompendiumConfig } from '../compendium/models';
import { RaceOrder, APP_TITLE } from './constants';
import { SmtSnesCompendiumModule } from './smt-snes-compendium.module';

import * as DEMON_DATA_JSON from './data/demon-data.json';
import * as SKILL_DATA_JSON from './data/skill-data.json';
import * as ALIGNMENT_JSON from './data/alignments.json';
import * as FUSION_CHART_JSON from './data/fusion-chart.json';
import * as ELEMENT_CHART_JSON from './data/element-chart.json';

export const fusionDataFactory = () => {
  return new FusionDataService(
    DEMON_DATA_JSON,
    SKILL_DATA_JSON,
    ALIGNMENT_JSON,
    FUSION_CHART_JSON,
    ELEMENT_CHART_JSON,
    'Shin Megami Tensei I'
  );
};

const compendiumConfig: CompendiumConfig = {
  appTitle: APP_TITLE,
  raceOrder: RaceOrder
};

@NgModule({
  imports: [
    CommonModule,
    SmtSnesCompendiumModule,
    CompendiumRoutingModule
  ],
  providers: [
    Title,
    { provide: FusionDataService, useFactory: fusionDataFactory },
    { provide: FUSION_DATA_SERVICE, useExisting: FusionDataService },
    { provide: FUSION_TRIO_SERVICE, useExisting: FusionDataService },
    { provide: COMPENDIUM_CONFIG, useValue: compendiumConfig }
  ]
})
export class CompendiumModule { }
