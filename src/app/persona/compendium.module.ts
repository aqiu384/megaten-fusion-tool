import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { SharedModule } from '../shared/shared.module';
import { SharedCompendiumModule } from '../compendium/compendium.module';

import { IngredientSelectionComponent } from './components/ingredient-selection.component';
import { TriangleFusionTableComponent } from './components/triangle-fusion-table.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedCompendiumModule
  ],
  declarations: [
    IngredientSelectionComponent,
    TriangleFusionTableComponent
  ]
})
export class PersonaCompendiumModule { }
