import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import {
  FusionTableComponent,
  FusionTableHeaderComponent,
  FusionTableRowComponent
} from './components/fusion-table.component';

import {
  ReverseFusionTableComponent,
  SpecialReverseFusionTableComponent,
  ExceptionReverseFusionTableComponent
} from './components/reverse-fusion-table.component';

import {
  SkillCostToStringPipe,
  SkillLevelToStringPipe,
  ElementAffinityToStringPipe,
  LvlToNumberPipe
} from './pipes';

import { ForwardFusionTableComponent } from './components/forward-fusion-table.component';
import { CompendiumComponent } from './components/compendium.component';
import { FusionRecipesComponent } from './components/fusion-recipes.component';
import { DlcFusionSettingsComponent } from './components/dlc-fusion-settings.component';
import { CurrentDemonService } from './current-demon.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    CompendiumComponent,
    FusionRecipesComponent,
    FusionTableComponent,
    FusionTableHeaderComponent,
    FusionTableRowComponent,
    ForwardFusionTableComponent,
    ReverseFusionTableComponent,
    SpecialReverseFusionTableComponent,
    ExceptionReverseFusionTableComponent,
    DlcFusionSettingsComponent,
    SkillCostToStringPipe,
    SkillLevelToStringPipe,
    ElementAffinityToStringPipe,
    LvlToNumberPipe
  ],
  exports: [
    CompendiumComponent,
    FusionRecipesComponent,
    ForwardFusionTableComponent,
    ReverseFusionTableComponent,
    DlcFusionSettingsComponent,
    SkillCostToStringPipe,
    SkillLevelToStringPipe,
    ElementAffinityToStringPipe,
    LvlToNumberPipe
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
