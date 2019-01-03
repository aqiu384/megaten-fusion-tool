import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { SharedModule } from '../shared/shared.module';
import { SharedCompendiumModule } from '../compendium/compendium.module';
import { CompendiumRoutingModule } from './compendium-routing.module';

import { CompendiumComponent } from './components/compendium.component';
import { DemonListContainerComponent } from './components/demon-list.component';
import { SkillListContainerComponent } from './components/skill-list.component';
import { DemonDlcSettingsContainerComponent } from './components/demon-dlc-settings.component';

import { DemonEntryComponent, DemonEntryContainerComponent } from './components/demon-entry.component';
import { EnemyEntryComponent } from './components/enemy-entry.component';

import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { CompendiumConfig } from './models';

import * as COMP_CONFIG_JSON from './data/comp-config.json';
import * as DEMON_DATA_JSON from './data/demon-data.json';
import * as SKILL_DATA_JSON from './data/skill-data.json';
import * as DLC_DATA_JSON from './data/dlc-data.json';
import * as ENEMY_DATA_JSON from './data/enemy-data.json';
import * as FUSION_CHART_JSON from '../pq/data/fusion-chart.json';
import * as SPECIAL_RECIPES_JSON from './data/special-recipes.json';

function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

const resistElems = COMP_CONFIG_JSON['resistElems'];
const skillElems = resistElems.concat(COMP_CONFIG_JSON['skillElems']);
const races = COMP_CONFIG_JSON['races'];

export const PQ2_COMPENDIUM_CONFIG: CompendiumConfig = {
  appTitle: 'Persona Q2: New Cinema Labyrinth',
  races,
  raceOrder: getEnumOrder(races),
  appCssClasses: ['pq2'],

  skillData: SKILL_DATA_JSON,
  skillElems,
  elemOrder: getEnumOrder(skillElems),
  resistCodes: COMP_CONFIG_JSON['resistCodes'],

  demonData: DEMON_DATA_JSON,
  dlcData: DLC_DATA_JSON,
  baseStats: ['HP', 'MP'],
  resistElems: [],

  enemyData: ENEMY_DATA_JSON,
  enemyStats: ['HP', 'Patk', 'Matk'],
  enemyResists: resistElems,

  normalTable: FUSION_CHART_JSON,
  hasTripleFusion: true,
  specialRecipes: SPECIAL_RECIPES_JSON,

  settingsKey: 'pq2-fusion-tool-settings',
  settingsVersion: 1709211400
};

export const fusionDataFactory = () => {
  return new FusionDataService(PQ2_COMPENDIUM_CONFIG);
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedCompendiumModule,
    CompendiumRoutingModule
  ],
  declarations: [
    CompendiumComponent,
    DemonListContainerComponent,
    SkillListContainerComponent,
    DemonEntryComponent,
    DemonEntryContainerComponent,
    EnemyEntryComponent,
    DemonDlcSettingsContainerComponent
  ],
  providers: [
    Title,
    { provide: FusionDataService, useFactory: fusionDataFactory },
    [{ provide: FUSION_DATA_SERVICE, useExisting: FusionDataService }],
    [{ provide: FUSION_TRIO_SERVICE, useExisting: FusionDataService }],
    [{ provide: COMPENDIUM_CONFIG, useValue: PQ2_COMPENDIUM_CONFIG }]
  ]
})
export class CompendiumModule { }
