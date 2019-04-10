import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../pq2/compendium-routing.module';
import { FusionDataService } from '../pq2/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { PersonaCompendiumModule } from '../pq2/persona-compendium.module';
import { CompendiumConfig } from '../pq2/models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import DLC_DATA_JSON from './data/dlc-data.json';
import ENEMY_DATA_JSON from './data/enemy-data.json';
import FUSION_CHART_JSON from '../pq/data/fusion-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import DEMON_CODES_JSON from './data/demon-codes.json';
import SKILL_CODES_JSON from './data/skill-codes.json';

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

for (const demon of Object.values(DEMON_DATA_JSON)) {
  demon['inherit'] = demon['inherit'].slice(0, 3);
}

for (const demon of Object.values(DLC_DATA_JSON)) {
  demon['inherit'] = demon['inherit'].slice(0, 3);
}

for (const enemy of Object.values(ENEMY_DATA_JSON)) {
  enemy['stats'] = enemy['stats'].slice(0, 3);
  enemy['resists'] = enemy['resists'].slice(0, 9);
}

export const PQ_COMPENDIUM_CONFIG: CompendiumConfig = {
  appTitle: 'Persona Q: Shadow of the Labyrinth',
  races,
  raceOrder: getEnumOrder(races),
  appCssClasses: ['pq1'],

  skillData: SKILL_DATA_JSON,
  skillElems,
  elemOrder: getEnumOrder(skillElems),
  resistCodes: COMP_CONFIG_JSON['resistCodes'],

  demonData: DEMON_DATA_JSON,
  dlcData: DLC_DATA_JSON,
  baseStats: ['HP', 'MP'],
  resistElems: [],

  enemyData: ENEMY_DATA_JSON,
  enemyStats: ['HP', 'Atk', 'Def'],
  enemyResists: resistElems,

  normalTable: FUSION_CHART_JSON,
  hasTripleFusion: true,
  specialRecipes: SPECIAL_RECIPES_JSON,

  settingsKey: 'pq-fusion-tool-settings',
  settingsVersion: 1709211400
};

@NgModule({
  imports: [
    CommonModule,
    PersonaCompendiumModule,
    CompendiumRoutingModule
  ],
  providers: [
    Title,
    FusionDataService,
    [{ provide: FUSION_DATA_SERVICE, useExisting: FusionDataService }],
    [{ provide: FUSION_TRIO_SERVICE, useExisting: FusionDataService }],
    [{ provide: COMPENDIUM_CONFIG, useValue: PQ_COMPENDIUM_CONFIG }],
  ]
})
export class CompendiumModule { }
