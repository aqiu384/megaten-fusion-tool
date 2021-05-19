import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { SharedCompendiumModule } from '../compendium/compendium.module';
import { CompendiumRoutingModule } from './compendium-routing.module';

import { CompendiumComponent } from './components/compendium.component';
import { DemonListContainerComponent } from './components/demon-list.component';
import { SkillListContainerComponent } from './components/skill-list.component';
import { DemonDlcSettingsContainerComponent } from './components/demon-dlc-settings.component';

import { DemonEntryComponent, DemonEntryContainerComponent } from './components/demon-entry.component';
import { PasswordGeneratorComponent, PasswordGeneratorContainerComponent } from './components/password-generator.component';
import { EnemyEntryComponent } from './components/enemy-entry.component';
import { QrcodeComponent } from './components/qrcode-component';

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
    DemonDlcSettingsContainerComponent,
    PasswordGeneratorComponent,
    PasswordGeneratorContainerComponent
  ],
  exports: [
    QrcodeComponent,
    CompendiumComponent,
    DemonListContainerComponent,
    SkillListContainerComponent,
    DemonEntryComponent,
    DemonEntryContainerComponent,
    EnemyEntryComponent,
    DemonDlcSettingsContainerComponent,
    PasswordGeneratorComponent,
    PasswordGeneratorContainerComponent
  ],
})
export class PersonaCompendiumModule {
  static forRoot(): ModuleWithProviders<PersonaCompendiumModule> {
    return {
      ngModule: PersonaCompendiumModule
    };
  }
}