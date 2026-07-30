import { Routes } from '@angular/router';

import { CompendiumComponent } from './components/compendium.component';
import { DemonListContainerComponent } from './components/demon-list.component';
import { SkillListContainerComponent } from './components/skill-list.component';
import { DemonEntryContainerComponent } from './components/demon-entry.component';
import { FusionChartContainerComponent } from './components/fusion-chart.component';

import { P5SFissionTableComponent } from './components/p5s-fission-table.component';
import { P5SFusionTableComponent } from './components/p5s-fusion-table.component';
import { COMPENDIUM_CONFIG } from '../compendium/constants';
import { CompendiumConfig } from './models';

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
            path: 'fissions',
            component: P5SFissionTableComponent
          },
          {
            path: 'fusions',
            component: P5SFusionTableComponent
          },
          {
            path: '**',
            redirectTo: 'fissions',
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
        path: 'chart',
        component: FusionChartContainerComponent,
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'personas',
    pathMatch: 'full'
  },
];

export function createCompendiumRoutes(compConfig: CompendiumConfig): Routes {
  return [{
    path: '',
    providers: [{ provide: COMPENDIUM_CONFIG, useValue: compConfig }],
    children: compendiumRoutes
  }];
}
