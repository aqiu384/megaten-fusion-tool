import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompendiumComponent } from './components/compendium.component';
import { DemonListContainerComponent } from './components/demon-list.component';
import { DemonEntryContainerComponent } from './components/demon-entry.component';
import { EnemyEntryComponent } from './components/enemy-entry.component';
import { SkillListContainerComponent } from './components/skill-list.component';
import { FusionChartContainerComponent } from './components/fusion-chart.component';

import { SmtFissionTableComponent } from '../compendium/components/smt-fission-table.component';
import { SmtFusionTableComponent } from '../compendium/components/smt-fusion-table.component';
import { SmtFusionsComponent } from '../compendium/components/smt-fusions.component';

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
        component: DemonEntryContainerComponent
      },
      {
        path: 'demons/:demonName',
        component: DemonEntryContainerComponent
      },
      {
        path: 'personas',
        component: DemonListContainerComponent
      },
      {
        path: 'demons',
        component: DemonListContainerComponent,
        data: { showEnemies: true }
      },
      {
        path: 'skills',
        component: SkillListContainerComponent
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
