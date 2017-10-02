import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { SharedModule } from '../shared/shared.module';
import { SharedCompendiumModule } from '../compendium/compendium.module';
import { CompendiumRoutingModule } from './compendium-routing.module';

import { CompendiumComponent } from './components/compendium.component';

import {
  DemonListComponent,
  DemonTableHeaderComponent,
  DemonTableRowComponent,
  DemonListContainerComponent
} from './components/demon-list.component';

import {
  SkillListComponent,
  SkillTableHeaderComponent,
  SkillTableRowComponent,
  SkillListContainerComponent
} from './components/skill-list.component';

import {
  FusionSettingsComponent
} from './components/fusion-settings.component';

import {
  DemonEntryComponent,
  DemonEntryContainerComponent
} from './components/demon-entry.component';

import {
  DemonSkillsComponent,
} from './components/demon-skills.component';

import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { CompendiumConfig } from '../compendium/models';
import { RaceOrder } from './models/constants';
import { calculateReverseFusions } from './models/reverse-fusion-calculator';
import { calculateForwardFusions } from './models/forward-fusion-calculator';

const compendiumConfig: CompendiumConfig = {
  raceOrder: RaceOrder,
  reverseFuse: calculateReverseFusions,
  forwardFuse: calculateForwardFusions
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
    DemonListComponent,
    DemonTableHeaderComponent,
    DemonTableRowComponent,
    DemonListContainerComponent,
    SkillListComponent,
    SkillTableHeaderComponent,
    SkillTableRowComponent,
    SkillListContainerComponent,
    DemonEntryComponent,
    DemonEntryContainerComponent,
    DemonSkillsComponent,
    FusionSettingsComponent
  ],
  providers: [
    Title,
    FusionDataService,
    [{ provide: FUSION_DATA_SERVICE, useExisting: FusionDataService }],
    [{ provide: COMPENDIUM_CONFIG, useValue: compendiumConfig }]
  ]
})
export class CompendiumModule { }
