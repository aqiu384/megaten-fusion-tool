import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompendiumComponent } from './components/compendium.component';
import { DemonListContainerComponent } from './components/demon-list.component';
import { DemonEntryContainerComponent } from './components/demon-entry.component';
import { SkillListContainerComponent } from './components/skill-list.component';
import { FusionChartContainerComponent } from './components/fusion-chart.component';

import { Dx2FissionTableComponent } from './components/dx2-fission-table.component';
import { Dx2FusionTableComponent } from './components/dx2-fusion-table.component';

const compendiumRoutes: Routes = [
  { path: '', redirectTo: 'demons', pathMatch: 'full' },
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
        path: 'demons/:demonName',
        component: DemonEntryContainerComponent,
        children: [
          {
            path: 'fissions',
            component: Dx2FissionTableComponent
          },
          {
            path: 'fusions',
            component: Dx2FusionTableComponent
          },
          {
            path: '**',
            redirectTo: 'fissions',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'demons',
        component: DemonListContainerComponent
      },
      {
        path: 'skills',
        component: SkillListContainerComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'demons',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [ RouterModule.forChild(compendiumRoutes) ],
  exports: [ RouterModule ]
})
export class CompendiumRoutingModule { }
