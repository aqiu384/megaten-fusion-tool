import { Routes } from '@angular/router';
import { CompendiumComponent } from './components/compendium.component';
import { DemonListContainerComponent } from './components/demon-list.component';
import { DemonEntryContainerComponent } from './components/demon-entry.component';
import { SkillListContainerComponent } from './components/skill-list.component';
import { FusionChartContainerComponent } from './components/fusion-chart.component';
import { FUSION_DATA_SERVICE } from '../compendium/constants';
import { COMPENDIUM_CONFIG, FusionDataService } from './fusion-data.service';
import { CompendiumConfig } from './models';

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

export function createCompendiumRoutes(compConfig: CompendiumConfig): Routes {
  return [{
    path: '',
    providers: [
      { provide: COMPENDIUM_CONFIG, useValue: compConfig },
      FusionDataService,
      { provide: FUSION_DATA_SERVICE, useExisting: FusionDataService }
    ],
    children: compendiumRoutes
  }];
}
