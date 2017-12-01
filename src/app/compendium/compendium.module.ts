import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { FusionEntryTableComponent } from './components/fusion-entry-table.component';

import { DemonListHeaderComponent } from './components/demon-list-header.component';
import { SkillListHeaderComponent } from './components/skill-list-header.component';

import { DemonStatsComponent } from './components/demon-stats.component';
import { DemonResistsComponent } from './components/demon-resists.component';
import { DemonSkillsComponent } from './components/demon-skills.component';
import { DemonInheritsComponent } from './components/demon-inherits.component';
import { DemonDlcSettingsComponent } from './components/demon-dlc-settings.component';

import { SmtDemonListComponent, SmtDemonListRowComponent } from './components/smt-demon-list.component';
import { SmtSkillListComponent, SmtSkillListRowComponent } from './components/smt-skill-list.component';

import { CompendiumComponent } from './components/compendium.component';
import { SmtFusionsComponent } from './components/smt-fusions.component';

import { CurrentDemonService } from './current-demon.service';

import { SmtFissionTableComponent } from './components/smt-fission-table.component';
import { SmtFusionTableComponent } from './components/smt-fusion-table.component';
import {
  FusionPairTableComponent,
  FusionPairTableHeaderComponent,
  FusionPairTableRowComponent
} from './components/fusion-pair-table.component';

import { TripleFissionTableComponent } from './components/tri-fission-table.component';
import { TripleFusionTableComponent } from './components/tri-fusion-table.component';
import {
  FusionTrioTableComponent,
  FusionTrioTableHeaderComponent,
  FusionTrioTableRowComponent
} from './components/fusion-trio-table.component';

import {
  SkillCostToStringPipe,
  SkillLevelToStringPipe,
  SkillLevelToShortStringPipe,
  ElementAffinityToStringPipe,
  LvlToNumberPipe,
  ReslvlToStringPipe,
  RoundInheritPercentPipe
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
    DemonInheritsComponent,
    DemonDlcSettingsComponent,
    DemonListHeaderComponent,
    SkillListHeaderComponent,
    SmtDemonListComponent,
    SmtDemonListRowComponent,
    SmtSkillListComponent,
    SmtSkillListRowComponent,
    FusionEntryTableComponent,
    CompendiumComponent,
    SmtFusionsComponent,
    FusionPairTableHeaderComponent,
    FusionPairTableRowComponent,
    FusionPairTableComponent,
    SmtFissionTableComponent,
    SmtFusionTableComponent,
    FusionTrioTableHeaderComponent,
    FusionTrioTableRowComponent,
    FusionTrioTableComponent,
    TripleFissionTableComponent,
    TripleFusionTableComponent,
    SkillCostToStringPipe,
    SkillLevelToStringPipe,
    SkillLevelToShortStringPipe,
    ElementAffinityToStringPipe,
    LvlToNumberPipe,
    ReslvlToStringPipe,
    RoundInheritPercentPipe
  ],
  exports: [
    DemonStatsComponent,
    DemonResistsComponent,
    DemonSkillsComponent,
    DemonInheritsComponent,
    DemonDlcSettingsComponent,
    DemonListHeaderComponent,
    SkillListHeaderComponent,
    SmtDemonListComponent,
    SmtDemonListRowComponent,
    SmtSkillListComponent,
    SmtSkillListRowComponent,
    FusionEntryTableComponent,
    CompendiumComponent,
    SmtFusionsComponent,
    FusionPairTableComponent,
    SmtFissionTableComponent,
    SmtFusionTableComponent,
    FusionTrioTableComponent,
    TripleFissionTableComponent,
    TripleFusionTableComponent,
    SkillCostToStringPipe,
    SkillLevelToStringPipe,
    SkillLevelToShortStringPipe,
    ElementAffinityToStringPipe,
    LvlToNumberPipe,
    ReslvlToStringPipe,
    RoundInheritPercentPipe
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
