import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { SharedCompendiumModule } from '../compendium/compendium.module';
import { CompendiumRoutingModule } from './compendium-routing.module';

import { CompendiumComponent } from './components/compendium.component';
import { DemonListContainerComponent } from './components/demon-list.component';
import { SkillListContainerComponent } from './components/skill-list.component';
import { FusionChartContainerComponent, P1FusionChartComponent } from './components/fusion-chart.component';

import { DemonEntryComponent, DemonEntryContainerComponent } from './components/demon-entry.component';
import { EnemyEntryComponent } from './components/enemy-entry.component';
import { P1FissionTableComponent } from './components/p1-fission-table.component';
import { P1FusionTableComponent } from './components/p1-fusion-table.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedCompendiumModule,
    CompendiumRoutingModule
  ],
  declarations: [
    CompendiumComponent,
    DemonEntryComponent,
    DemonEntryContainerComponent,
    DemonListContainerComponent,
    EnemyEntryComponent,
    P1FissionTableComponent,
    P1FusionTableComponent,
    P1FusionChartComponent,
    SkillListContainerComponent,
    FusionChartContainerComponent
  ],
  exports: [
    CompendiumComponent,
    DemonEntryComponent,
    DemonEntryContainerComponent,
    DemonListContainerComponent,
    EnemyEntryComponent,
    P1FissionTableComponent,
    P1FusionTableComponent,
    P1FusionChartComponent,
    SkillListContainerComponent,
    FusionChartContainerComponent
  ]
})
export class P1CompendiumModule {
  static forRoot(): ModuleWithProviders<P1CompendiumModule> {
    return {
      ngModule: P1CompendiumModule
    };
  }
}
