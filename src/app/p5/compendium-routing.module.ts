import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompendiumComponent } from './components/compendium.component';
import { DemonListContainerComponent } from './components/demon-list.component';
import { SkillListContainerComponent } from './components/skill-list.component';
import { FusionSettingsComponent } from './components/fusion-settings.component';
import { DemonEntryContainerComponent } from './components/demon-entry.component';

import { ReverseFusionTableComponent } from '../compendium/components/reverse-fusion-table.component';
import { ForwardFusionTableComponent } from '../compendium/components/forward-fusion-table.component';

const compendiumRoutes: Routes = [
  { path: '', redirectTo: 'personas', pathMatch: 'full' },
  {
    path: '',
    component: CompendiumComponent,
    children: [
      {
        path: 'personas/:demonName',
        component: DemonEntryContainerComponent,
        children: [
          {
            path: 'reverse-fusions',
            component: ReverseFusionTableComponent
          },
          {
            path: 'forward-fusions',
            component: ForwardFusionTableComponent
          },
          {
            path: '**',
            redirectTo: 'reverse-fusions',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'personas',
        component: DemonListContainerComponent
      },
      {
        path: 'skills',
        component: SkillListContainerComponent
      },
      {
        path: 'settings',
        component: FusionSettingsComponent
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
