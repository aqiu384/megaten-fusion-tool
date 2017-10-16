import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { SharedModule } from '../shared/shared.module';
import { SharedCompendiumModule } from '../compendium/compendium.module';

import { TripleFissionTableComponent } from './components/triple-fission-table.component';
import { TripleFusionTableComponent } from './components/triple-fusion-table.component';

import {
  FusionTrioTableComponent,
  FusionTrioTableHeaderComponent,
  FusionTrioTableRowComponent
} from './components/fusion-trio-table.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    SharedCompendiumModule
  ],
  declarations: [
    TripleFissionTableComponent,
    TripleFusionTableComponent,
    FusionTrioTableComponent,
    FusionTrioTableHeaderComponent,
    FusionTrioTableRowComponent
  ]
})
export class PersonaCompendiumModule { }
