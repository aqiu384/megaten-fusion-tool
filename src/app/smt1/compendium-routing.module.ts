import { Routes } from '@angular/router';
import { CompendiumComponent } from './components/compendium.component';
import { DemonListContainerComponent } from './components/demon-list.component';
import { SkillListContainerComponent } from './components/skill-list.component';
import { FusionChartContainerComponent } from './components/fusion-chart.component';
import { DemonEntryContainerComponent } from './components/demon-entry.component';
import { SmtFissionTableComponent } from '../compendium/components/smt-fission-table.component';
import { SmtFusionTableComponent } from '../compendium/components/smt-fusion-table.component';
import { TripleFissionTableComponent } from '../compendium/components/tri-fission-table.component';
import { TripleFusionTableComponent } from '../compendium/components/tri-fusion-table.component';
import { FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { COMPENDIUM_CONFIG, FusionDataService } from './fusion-data.service';
import { CompendiumConfig } from './models';

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
            path: 'fissions/triple',
            component: TripleFissionTableComponent
          },
          {
            path: 'fusions/triple',
            component: TripleFusionTableComponent
          },
          {
            path: 'fissions',
            component: SmtFissionTableComponent
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

export function createCompendiumRoutes(compConfig: CompendiumConfig): Routes {
  return [{
    path: '',
    providers: [
      { provide: COMPENDIUM_CONFIG, useValue: compConfig },
      FusionDataService,
      { provide: FUSION_DATA_SERVICE, useExisting: FusionDataService },
      { provide: FUSION_TRIO_SERVICE, useExisting: FusionDataService }
    ],
    children: compendiumRoutes
  }];
}
