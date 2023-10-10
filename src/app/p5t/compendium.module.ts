import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../pq2/compendium-routing.module';
import { FusionDataService } from '../pq2/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { PQCompendiumModule } from '../pq2/pq-compendium.module';
import { CompendiumConfig } from '../pq2/models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import DLC_DATA_JSON from './data/dlc-data.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';

function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

const resistElems = COMP_CONFIG_JSON.resistElems;
const skillElems = resistElems.concat(COMP_CONFIG_JSON.skillElems);
const races = [];
const inheritTypes: { [elem: string]: number } = {};

for(const race of COMP_CONFIG_JSON.races) {
  races.push(race);
  races.push(race + ' P');
}

for (const demon of Object.values(DEMON_DATA_JSON)) {
  demon['code'] = 1;
  demon['inherit'] = demon['race'].substring(0, 3).toLowerCase();
}

for (const skill of Object.values(SKILL_DATA_JSON)) {
  skill['code'] = 1;
  skill['effect'] = skill['power'] + ' dmg'
}

for (const demon of Object.values(DLC_DATA_JSON)) {
  demon['inherit'] = demon['race'].substring(0, 3).toLowerCase();
}

for (const [elem, inherits] of Object.entries(COMP_CONFIG_JSON.inheritTypes)) {
  inheritTypes[elem] = parseInt(inherits, 2);
}

export const PQ_COMPENDIUM_CONFIG: CompendiumConfig = {
  appTitle: 'Persona 5 Tactica',
  races,
  raceOrder: getEnumOrder(races),
  appCssClasses: ['p5t'],

  skillData: SKILL_DATA_JSON,
  skillElems,
  ailmentElems: COMP_CONFIG_JSON.ailments,
  elemOrder: getEnumOrder(skillElems),
  resistCodes: COMP_CONFIG_JSON.resistCodes,

  demonData: DEMON_DATA_JSON,
  dlcData: DLC_DATA_JSON,
  baseStats: ['HP', 'MP', 'At', 'Bt'],
  resistElems: [],
  inheritTypes,
  inheritElems: COMP_CONFIG_JSON.inheritElems,

  enemyData: [],
  enemyStats: ['HP', 'Atk', 'Def'],
  enemyResists: resistElems,

  normalTable: FUSION_CHART_JSON,
  hasTripleFusion: false,
  specialRecipes: {},

  settingsKey: 'p5t-fusion-tool-settings',
  settingsVersion: 1709211400
};

@NgModule({
  imports: [
    CommonModule,
    PQCompendiumModule,
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
