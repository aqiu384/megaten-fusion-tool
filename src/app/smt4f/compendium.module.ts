import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { SharedModule } from '../shared/shared.module';
import { SharedCompendiumModule } from '../compendium/compendium.module';
import { CompendiumRoutingModule } from './compendium-routing.module';

import { CompendiumComponent } from './components/compendium.component';

import {
  DemonListContainerComponent
} from './components/demon-list.component';

import {
  SkillListContainerComponent
} from './components/skill-list.component';

import { FusionChartContainerComponent } from './components/fusion-chart.component';

import {
  DemonEntryComponent,
  DemonEntryContainerComponent
} from './components/demon-entry.component';

import { DemonDlcSettingsContainerComponent } from './components/demon-dlc-settings.component';

import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { CompendiumConfig } from '../compendium/models';
import { RaceOrder } from '../smt4/models/constants';
import { APP_TITLE } from './models/constants';

const compendiumConfig: CompendiumConfig = {
  appTitle: APP_TITLE,
  raceOrder: RaceOrder,
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedCompendiumModule,
    CompendiumRoutingModule
  ],
  declarations: [
    CompendiumComponent,
    DemonListContainerComponent,
    SkillListContainerComponent,
    DemonDlcSettingsContainerComponent,
    DemonEntryComponent,
    DemonEntryContainerComponent,
    FusionChartContainerComponent
  ],
  providers: [
    Title,
    FusionDataService,
    [{ provide: FUSION_DATA_SERVICE, useExisting: FusionDataService }],
    [{ provide: COMPENDIUM_CONFIG, useValue: compendiumConfig }]
  ]
})
export class CompendiumModule { }
