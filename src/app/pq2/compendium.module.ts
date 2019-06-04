import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from './compendium-routing.module';
import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { PersonaCompendiumModule } from './persona-compendium.module';
import { CompendiumConfig } from './models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import DLC_DATA_JSON from './data/dlc-data.json';
import ENEMY_DATA_JSON from './data/enemy-data.json';
import FUSION_CHART_JSON from '../pq/data/fusion-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import PARTY_DATA_JSON from './data/party-data.json';
import PARTY_SKILLS_JSON from './data/party-skills.json';
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
const races = [];

for(const race of COMP_CONFIG_JSON['races']) {
  races.push(race);
  races.push(race + ' P');
}

for (const [demon, entry] of Object.entries(PARTY_DATA_JSON)) {
  entry.race = entry.race + ' P';
  entry['fusion'] = 'party';
  DEMON_DATA_JSON[demon] = entry;
}

for (const [skill, entry] of Object.entries(PARTY_SKILLS_JSON)) {
  entry['unique'] = true;
  SKILL_DATA_JSON[skill] = entry;
}

for (const enemy of Object.values(ENEMY_DATA_JSON)) {
  enemy['stats'] = [enemy['lvl']].concat(enemy['stats']);
  enemy['lvl'] = Math.floor(enemy['lvl'] / 20) + 1;
}

for (const [code, name] of Object.entries(DEMON_CODES_JSON)) {
  DEMON_DATA_JSON[name]['code'] = parseInt(code, 10);
}

for (const [code, name] of Object.entries(SKILL_CODES_JSON)) {
  SKILL_DATA_JSON[name]['code'] = parseInt(code, 10);
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
  enemyStats: ['HP', 'Atk', 'Def'],
  enemyResists: resistElems,

  normalTable: FUSION_CHART_JSON,
  hasTripleFusion: true,
  specialRecipes: SPECIAL_RECIPES_JSON,

  settingsKey: 'pq2-fusion-tool-settings',
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
    [{ provide: COMPENDIUM_CONFIG, useValue: PQ2_COMPENDIUM_CONFIG }]
  ]
})
export class CompendiumModule { }
