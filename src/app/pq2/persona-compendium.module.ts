import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { SharedCompendiumModule } from '../compendium/compendium.module';
import { CompendiumRoutingModule } from './compendium-routing.module';

import { CompendiumComponent } from './components/compendium.component';
import { DemonListContainerComponent } from './components/demon-list.component';
import { SkillListContainerComponent } from './components/skill-list.component';
import { DemonDlcSettingsContainerComponent } from './components/demon-dlc-settings.component';

import { DemonEntryComponent, DemonEntryContainerComponent } from './components/demon-entry.component';
import { EnemyEntryComponent } from './components/enemy-entry.component';

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
    EnemyEntryComponent,
    DemonDlcSettingsContainerComponent
  ],
  exports: [
    CompendiumComponent,
    DemonListContainerComponent,
    SkillListContainerComponent,
    DemonEntryComponent,
    DemonEntryContainerComponent,
    EnemyEntryComponent,
    DemonDlcSettingsContainerComponent
  ],
})
export class PersonaCompendiumModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PersonaCompendiumModule
    };
  }
}