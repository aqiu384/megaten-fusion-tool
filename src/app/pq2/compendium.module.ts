import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from './compendium-routing.module';
import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { PersonaCompendiumModule } from './persona-compendium.module';
import { CompendiumConfig } from './models';

import * as COMP_CONFIG_JSON from './data/comp-config.json';
import * as DEMON_DATA_JSON from './data/demon-data.json';
import * as SKILL_DATA_JSON from './data/skill-data.json';
import * as DLC_DATA_JSON from './data/dlc-data.json';
import * as ENEMY_DATA_JSON from './data/enemy-data.json';
import * as FUSION_CHART_JSON from '../pq/data/fusion-chart.json';
import * as SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import * as DEMON_CODES_JSON from './data/demon-codes.json';
import * as SKILL_CODES_JSON from './data/skill-codes.json';

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

for (const [code, name] of Object.entries(DEMON_CODES_JSON)) {
  DEMON_DATA_JSON[name]['code'] = parseInt(code, 10);
}

for (const [code, name] of Object.entries(SKILL_CODES_JSON)) {
  SKILL_DATA_JSON[name]['code'] = parseInt(code, 10);
}

for (const enemy of Object.values(ENEMY_DATA_JSON)) {
  enemy['stats'] = [enemy['lvl']].concat(enemy['stats']);
  enemy['lvl'] = Math.floor(enemy['lvl'] / 20) + 1;
}

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
    PersonaCompendiumModule,
    CompendiumRoutingModule
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
