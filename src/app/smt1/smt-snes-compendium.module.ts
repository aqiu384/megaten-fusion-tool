import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { SharedCompendiumModule } from '../compendium/compendium.module';
import { CompendiumRoutingModule } from './compendium-routing.module';

import { DemonListContainerComponent } from './components/demon-list.component';
import { SkillListContainerComponent } from './components/skill-list.component';
import { FusionChartContainerComponent } from './components/fusion-chart.component';
import { DemonEntryComponent, DemonEntryContainerComponent } from './components/demon-entry.component';
import { SpeciesTripleChartComponent } from './components/species-triple-chart.component';

import { CompendiumComponent } from './components/compendium.component';

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
    DemonEntryComponent,
    DemonEntryContainerComponent,
    FusionChartContainerComponent,
    SpeciesTripleChartComponent
  ],
  exports: [
    CompendiumComponent,
    DemonListContainerComponent,
    SkillListContainerComponent,
    DemonEntryComponent,
    DemonEntryContainerComponent,
    FusionChartContainerComponent,
    SpeciesTripleChartComponent
  ]
})
export class SmtSnesCompendiumModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SmtSnesCompendiumModule
    };
  }
}