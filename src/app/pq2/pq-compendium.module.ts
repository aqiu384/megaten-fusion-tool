import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { SharedCompendiumModule } from '../compendium/compendium.module';
import { CompendiumRoutingModule } from './compendium-routing.module';

import { CompendiumComponent } from './components/compendium.component';
import { DemonListContainerComponent } from './components/demon-list.component';
import { SkillListContainerComponent } from './components/skill-list.component';
import { FusionChartContainerComponent } from './components/fusion-chart.component';
import { FusionSettingsContainerComponent } from './components/fusion-settings.component';

import { DemonEntryComponent, DemonEntryContainerComponent } from './components/demon-entry.component';
import { PasswordGeneratorComponent, PasswordGeneratorContainerComponent } from './components/password-generator.component';
import { EnemyEntryComponent } from './components/enemy-entry.component';
import { QrcodeComponent } from './components/qrcode-component';
import { RecipeGeneratorContainerComponent } from './components/recipe-generator.component';
import { P5FissionTableComponent } from './components/p5-fission-table.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    SharedCompendiumModule,
    CompendiumRoutingModule
  ],
  declarations: [
    QrcodeComponent,
    CompendiumComponent,
    DemonListContainerComponent,
    SkillListContainerComponent,
    DemonEntryComponent,
    DemonEntryContainerComponent,
    EnemyEntryComponent,
    FusionChartContainerComponent,
    FusionSettingsContainerComponent,
    PasswordGeneratorComponent,
    PasswordGeneratorContainerComponent,
    P5FissionTableComponent,
    RecipeGeneratorContainerComponent
  ],
  exports: [
    QrcodeComponent,
    CompendiumComponent,
    DemonListContainerComponent,
    SkillListContainerComponent,
    DemonEntryComponent,
    DemonEntryContainerComponent,
    EnemyEntryComponent,
    FusionChartContainerComponent,
    FusionSettingsContainerComponent,
    PasswordGeneratorComponent,
    PasswordGeneratorContainerComponent,
    P5FissionTableComponent,
    RecipeGeneratorContainerComponent
  ],
})
export class PQCompendiumModule {
  static forRoot(): ModuleWithProviders<PQCompendiumModule> {
    return {
      ngModule: PQCompendiumModule
    };
  }
}
