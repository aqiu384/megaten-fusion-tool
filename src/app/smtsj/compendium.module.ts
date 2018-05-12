import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { SharedModule } from '../shared/shared.module';
import { SharedCompendiumModule } from '../compendium/compendium.module';
import { CompendiumRoutingModule } from './compendium-routing.module';

import { CompendiumComponent } from './components/compendium.component';
import { DemonListContainerComponent } from './components/demon-list.component';
import { SkillListContainerComponent } from './components/skill-list.component';
import { DemonEntryComponent, DemonEntryContainerComponent } from './components/demon-entry.component';
import { FusionChartContainerComponent } from './components/fusion-chart.component';
import { FusionSettingsComponent } from './components/fusion-settings.component';
import { PasswordGeneratorComponent, PasswordGeneratorContainerComponent } from './components/password-generator.component';
import { DemonPasswordComponent, ReduxDemonPasswordComponent } from './components/demon-password.component';

import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { CompendiumConfig } from '../compendium/models';
import { RaceOrder, APP_TITLE } from './models/constants';

const compendiumConfig: CompendiumConfig = {
  appTitle: APP_TITLE,
  raceOrder: RaceOrder
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    SharedCompendiumModule,
    CompendiumRoutingModule
  ],
  declarations: [
    CompendiumComponent,
    FusionSettingsComponent,
    DemonEntryComponent,
    DemonEntryContainerComponent,
    DemonListContainerComponent,
    SkillListContainerComponent,
    FusionChartContainerComponent,
    PasswordGeneratorComponent,
    PasswordGeneratorContainerComponent,
    DemonPasswordComponent,
    ReduxDemonPasswordComponent
  ],
  providers: [
    Title,
    FusionDataService,
    [{ provide: FUSION_DATA_SERVICE, useExisting: FusionDataService }],
    [{ provide: COMPENDIUM_CONFIG, useValue: compendiumConfig }]
  ]
})
export class CompendiumModule { }
