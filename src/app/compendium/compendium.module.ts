import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { FusionEntryTableComponent } from './components/fusion-entry-table.component';
import {
  FusionPairTableComponent,
  FusionPairTableHeaderComponent,
  FusionPairTableRowComponent
} from './components/fusion-pair-table.component';

import { DemonListHeaderComponent } from './components/demon-list-header.component';
import { SkillListHeaderComponent } from './components/skill-list-header.component';

import { DemonStatsComponent } from './components/demon-stats.component';
import { DemonResistsComponent } from './components/demon-resists.component';
import { DemonSkillsComponent } from './components/demon-skills.component';
import { DemonDlcSettingsComponent } from './components/demon-dlc-settings.component';

import { SmtFissionTableComponent } from './components/smt-fission-table.component';
import { SmtFusionTableComponent } from './components/smt-fusion-table.component';
import { SmtDemonListComponent, SmtDemonListRowComponent } from './components/smt-demon-list.component';
import { SmtSkillListComponent, SmtSkillListRowComponent } from './components/smt-skill-list.component';

import { CompendiumComponent } from './components/compendium.component';
import { SmtFusionsComponent } from './components/smt-fusions.component';

import { CurrentDemonService } from './current-demon.service';

import {
  SkillCostToStringPipe,
  SkillLevelToStringPipe,
  SkillLevelToShortStringPipe,
  ElementAffinityToStringPipe,
  LvlToNumberPipe,
  ReslvlToStringPipe
} from './pipes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    DemonStatsComponent,
    DemonResistsComponent,
    DemonSkillsComponent,
    DemonDlcSettingsComponent,
    DemonListHeaderComponent,
    SkillListHeaderComponent,
    SmtDemonListComponent,
    SmtDemonListRowComponent,
    SmtSkillListComponent,
    SmtSkillListRowComponent,
    FusionEntryTableComponent,
    FusionPairTableComponent,
    FusionPairTableHeaderComponent,
    FusionPairTableRowComponent,
    SmtFissionTableComponent,
    SmtFusionTableComponent,
    CompendiumComponent,
    SmtFusionsComponent,
    SkillCostToStringPipe,
    SkillLevelToStringPipe,
    SkillLevelToShortStringPipe,
    ElementAffinityToStringPipe,
    LvlToNumberPipe,
    ReslvlToStringPipe
  ],
  exports: [
    DemonStatsComponent,
    DemonResistsComponent,
    DemonSkillsComponent,
    DemonDlcSettingsComponent,
    DemonListHeaderComponent,
    SkillListHeaderComponent,
    SmtDemonListComponent,
    SmtDemonListRowComponent,
    SmtSkillListComponent,
    SmtSkillListRowComponent,
    FusionEntryTableComponent,
    FusionPairTableComponent,
    SmtFissionTableComponent,
    SmtFusionTableComponent,
    CompendiumComponent,
    SmtFusionsComponent,
    SkillCostToStringPipe,
    SkillLevelToStringPipe,
    SkillLevelToShortStringPipe,
    ElementAffinityToStringPipe,
    LvlToNumberPipe,
    ReslvlToStringPipe
  ]
})
export class SharedCompendiumModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedCompendiumModule,
      providers: [ CurrentDemonService ]
    };
  }
}
