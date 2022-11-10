import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../p5/compendium-routing.module';
import { FusionDataService } from '../p5/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { P5CompendiumModule } from '../p5/p5-compendium.module';
import { CompendiumConfig } from '../p5/models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import INHERIT_TYPES_JSON from '../p5/data/inheritance-types.json';

import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import ENEMY_DATA_JSON from './data/enemy-data.json';
import PARTY_DATA_JSON from './data/party-data.json';
import DLC_DATA_JSON from './data/dlc-data.json';

import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';

function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
const inheritTypes: { [elem: string]: number } = {};
const races = [];

for(const race of COMP_CONFIG_JSON.races) {
  races.push(race);
  races.push(race + ' P');
}

for (let i = 0; i < INHERIT_TYPES_JSON.inherits.length; i++) {
  inheritTypes[INHERIT_TYPES_JSON.inherits[i]] = parseInt(INHERIT_TYPES_JSON.ratios[i], 2);
}

for (const json of [DEMON_DATA_JSON, DLC_DATA_JSON, PARTY_DATA_JSON]) {
  for (const entry of Object.values(json)) {
    entry['skills'][entry['trait']] = 0;
  }
}

for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
  DEMON_DATA_JSON[name].prereq = prereq;
}

for (const entry of Object.values(ENEMY_DATA_JSON)) {
  entry['exp'] = 0;
  entry['yen'] = 0;
  entry['stats'] = entry['stats'] ?
    [entry['stats'][0], Math.floor(entry['stats'][0] * 0.66)] :
    [entry.lvl * 15, entry.lvl * 10];
  entry['stats'] = entry['stats'].concat([0, 0, 0, 0, 0]);
  entry['area'] = [entry['areas']];
}

export const P5R_COMPENDIUM_CONFIG: CompendiumConfig = {
  appTitle: 'Persona 5 Royal',

  races,
  raceOrder: getEnumOrder(races),
  baseStats: COMP_CONFIG_JSON.baseStats,
  skillElems,
  resistElems: COMP_CONFIG_JSON.resistElems,
  resistCodes: COMP_CONFIG_JSON.resistCodes,
  elemOrder: getEnumOrder(skillElems),
  inheritTypes,
  inheritElems: INHERIT_TYPES_JSON.elems,

  enemyStats: ['HP', 'MP'],
  enemyResists: COMP_CONFIG_JSON.resistElems,

  demonData: [DEMON_DATA_JSON, DLC_DATA_JSON, PARTY_DATA_JSON],
  skillData: [SKILL_DATA_JSON],
  enemyData: [ENEMY_DATA_JSON],

  normalTable: FUSION_CHART_JSON,
  elementTable: ELEMENT_CHART_JSON,
  specialRecipes: SPECIAL_RECIPES_JSON,

  dlcDemons: COMP_CONFIG_JSON.dlcDemons,
  downloadedDemons: COMP_CONFIG_JSON.downloadedDemons,
  settingsKey: 'p5r-fusion-tool-settings',
  settingsVersion: 2211092300
};

@NgModule({
  imports: [
    CommonModule,
    P5CompendiumModule,
    CompendiumRoutingModule
  ],
  providers: [
    Title,
    FusionDataService,
    [{ provide: FUSION_DATA_SERVICE, useExisting: FusionDataService }],
    [{ provide: COMPENDIUM_CONFIG, useValue: P5R_COMPENDIUM_CONFIG }]
  ]
})
export class CompendiumModule { }
