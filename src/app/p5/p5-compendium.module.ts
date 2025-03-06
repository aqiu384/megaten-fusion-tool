import { NgModule, ModuleWithProviders } from '@angular/core';
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
import { EnemyEntryComponent } from './components/enemy-entry.component';
import { RecipeGeneratorContainerComponent } from './components/recipe-generator.component';
import { P5FissionTableComponent } from './components/p5-fission-table.component';

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
    FusionChartContainerComponent,
    FusionSettingsContainerComponent,
    DemonEntryComponent,
    DemonEntryContainerComponent,
    EnemyEntryComponent,
    P5FissionTableComponent,
    RecipeGeneratorContainerComponent
  ],
  exports: [
    CompendiumComponent,
    DemonListContainerComponent,
    SkillListContainerComponent,
    FusionChartContainerComponent,
    FusionSettingsContainerComponent,
    DemonEntryComponent,
    DemonEntryContainerComponent,
    EnemyEntryComponent,
    P5FissionTableComponent,
    RecipeGeneratorContainerComponent
  ],
})
export class P5CompendiumModule {
  static forRoot(): ModuleWithProviders<P5CompendiumModule> {
    return {
      ngModule: P5CompendiumModule
    };
  }
}
