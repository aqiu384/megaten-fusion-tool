import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared.module';

import { FusionEntryTableComponent } from './components/fusion-entry-table.component';
import { FusionChartComponent } from './components/fusion-chart.component';
import { RecipeGeneratorComponent } from './components/recipe-generator.component';

import { DemonListHeaderComponent } from './components/demon-list-header.component';
import { SkillListHeaderComponent } from './components/skill-list-header.component';

import { DemonMissingComponent } from './components/demon-missing.component';
import { DemonStatsComponent } from './components/demon-stats.component';
import { DemonResistsComponent } from './components/demon-resists.component';
import { DemonSkillsComponent } from './components/demon-skills.component';
import { DemonInheritsComponent } from './components/demon-inherits.component';
import { FusionSettingsComponent } from './components/fusion-settings.component';

import { SmtDemonListComponent, SmtDemonListRowComponent } from './components/smt-demon-list.component';
import { SmtSkillListComponent, SmtSkillListRowComponent } from './components/smt-skill-list.component';

import { CompendiumComponent, CompendiumHeaderComponent } from './components/compendium.component';
import { SmtFusionsComponent } from './components/smt-fusions.component';

import { CurrentDemonService } from './current-demon.service';

import { 
  FissionPreviewTableComponent,
  SmtFissionPreviewComponent,
  TrioFissionPreviewComponent
} from './components/fission-preview-table.component';
import { SmtFissionTableComponent } from './components/smt-fission-table.component';
import { SmtFusionTableComponent } from './components/smt-fusion-table.component';
import { FusionMultiPairTableComponent } from './components/fusion-multi-pair-table.component';
import {
  FusionPairTableComponent,
  FusionPairTableHeaderComponent,
  FusionPairTableRowComponent
} from './components/fusion-pair-table.component';

import { TripleFissionTableComponent } from './components/tri-fission-table.component';
import { TripleFusionTableComponent } from './components/tri-fusion-table.component';
import { TripleFusionChartComponent } from './components/tri-fusion-chart.component';
import {
  FusionTrioTableComponent,
  FusionTrioTableHeaderComponent,
  FusionTrioTableRowComponent
} from './components/fusion-trio-table.component';

import {
  TranslateCompPipe,
  SkillCostToStringPipe,
  SkillLevelToStringPipe,
  SkillLevelToShortStringPipe,
  ElementAffinityToStringPipe,
  LvlToNumberPipe,
  ReslvlToStringPipe,
  ReslvlToStringJaPipe,
  ReslvlToColorPipe,
  ResmodToStringPipe,
  RoundInheritPercentPipe
} from './pipes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    DemonMissingComponent,
    DemonStatsComponent,
    DemonResistsComponent,
    DemonSkillsComponent,
    DemonInheritsComponent,
    FusionSettingsComponent,
    DemonListHeaderComponent,
    SkillListHeaderComponent,
    SmtDemonListComponent,
    SmtDemonListRowComponent,
    SmtSkillListComponent,
    SmtSkillListRowComponent,
    FusionEntryTableComponent,
    FusionChartComponent,
    RecipeGeneratorComponent,
    CompendiumComponent,
    CompendiumHeaderComponent,
    SmtFusionsComponent,
    FusionPairTableHeaderComponent,
    FusionPairTableRowComponent,
    FusionPairTableComponent,
    FusionMultiPairTableComponent,
    FissionPreviewTableComponent,
    SmtFissionPreviewComponent,
    TrioFissionPreviewComponent,
    SmtFissionTableComponent,
    SmtFusionTableComponent,
    FusionTrioTableHeaderComponent,
    FusionTrioTableRowComponent,
    FusionTrioTableComponent,
    TripleFissionTableComponent,
    TripleFusionTableComponent,
    TripleFusionChartComponent,
    TranslateCompPipe,
    SkillCostToStringPipe,
    SkillLevelToStringPipe,
    SkillLevelToShortStringPipe,
    ElementAffinityToStringPipe,
    LvlToNumberPipe,
    ReslvlToStringPipe,
    ReslvlToStringJaPipe,
    ReslvlToColorPipe,
    ResmodToStringPipe,
    RoundInheritPercentPipe
  ],
  exports: [
    DemonMissingComponent,
    DemonStatsComponent,
    DemonResistsComponent,
    DemonSkillsComponent,
    DemonInheritsComponent,
    FusionSettingsComponent,
    DemonListHeaderComponent,
    SkillListHeaderComponent,
    SmtDemonListComponent,
    SmtDemonListRowComponent,
    SmtSkillListComponent,
    SmtSkillListRowComponent,
    FusionEntryTableComponent,
    FusionChartComponent,
    RecipeGeneratorComponent,
    CompendiumComponent,
    CompendiumHeaderComponent,
    SmtFusionsComponent,
    FusionPairTableComponent,
    FusionMultiPairTableComponent,
    FissionPreviewTableComponent,
    SmtFissionPreviewComponent,
    TrioFissionPreviewComponent,
    SmtFissionTableComponent,
    SmtFusionTableComponent,
    FusionTrioTableComponent,
    TripleFissionTableComponent,
    TripleFusionTableComponent,
    TripleFusionChartComponent,
    TranslateCompPipe,
    SkillCostToStringPipe,
    SkillLevelToStringPipe,
    SkillLevelToShortStringPipe,
    ElementAffinityToStringPipe,
    LvlToNumberPipe,
    ReslvlToStringPipe,
    ReslvlToStringJaPipe,
    ReslvlToColorPipe,
    ResmodToStringPipe,
    RoundInheritPercentPipe
  ]
})
export class SharedCompendiumModule {
  static forRoot(): ModuleWithProviders<SharedCompendiumModule> {
    return {
      ngModule: SharedCompendiumModule,
      providers: [CurrentDemonService]
    };
  }
}
