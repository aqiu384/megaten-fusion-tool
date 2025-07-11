import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompendiumComponent } from './components/compendium.component';
import { DemonListContainerComponent } from './components/demon-list.component';
import { SkillListContainerComponent } from './components/skill-list.component';
import { DemonEntryContainerComponent } from './components/demon-entry.component';
import { FusionChartContainerComponent } from './components/fusion-chart.component';
import { PasswordGeneratorContainerComponent } from './components/password-generator.component';
import { FusionSettingsContainerComponent } from './components/fusion-settings.component';
import { RecipeGeneratorContainerComponent } from './components/recipe-generator.component';
import { P5FissionTableComponent } from './components/p5-fission-table.component';

import { SmtFissionPreviewComponent } from '../compendium/components/fission-preview-table.component';
import { SmtFusionTableComponent } from '../compendium/components/smt-fusion-table.component';

import { TripleFissionTableComponent } from '../compendium/components/tri-fission-table.component';
import { TripleFusionTableComponent } from '../compendium/components/tri-fusion-table.component';

const compendiumRoutes: Routes = [
  { path: '', redirectTo: 'personas', pathMatch: 'full' },
  {
    path: '',
    component: CompendiumComponent,
    data: { fusionTool: 'chart' },
    children: [
      {
        path: 'chart',
        component: FusionChartContainerComponent,
      }
    ]
  },
  {
    path: '',
    component: CompendiumComponent,
    children: [
      {
        path: 'personas/:demonName',
        component: DemonEntryContainerComponent,
        children: [
          {
            path: 'fissions/triple',
            component: TripleFissionTableComponent
          },
          {
            path: 'fusions/triple',
            component: TripleFusionTableComponent
          },
          {
            path: 'fissions',
            component: P5FissionTableComponent
          },
          {
            path: 'fusions',
            component: SmtFusionTableComponent
          },
          {
            path: '**',
            redirectTo: 'fissions',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'shadows/:demonName',
        component: DemonEntryContainerComponent
      },
      {
        path: 'personas',
        component: DemonListContainerComponent
      },
      {
        path: 'shadows',
        component: DemonListContainerComponent,
        data: { showShadows: true }
      },
      {
        path: 'skills',
        component: SkillListContainerComponent
      },
      {
        path: 'qrcodes',
        component: PasswordGeneratorContainerComponent
      },
      {
        path: 'recipes',
        component: RecipeGeneratorContainerComponent
      },
      {
        path: 'settings',
        component: FusionSettingsContainerComponent
      },
      {
        path: 'previews',
        component: SmtFissionPreviewComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'personas',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [ RouterModule.forChild(compendiumRoutes) ],
  exports: [ RouterModule ]
})
export class CompendiumRoutingModule { }
