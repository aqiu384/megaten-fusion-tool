import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from './compendium-routing.module';
import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { PQCompendiumModule } from './pq-compendium.module';
import { CompendiumConfig } from './models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import DLC_DATA_JSON from './data/dlc-data.json';
import ENEMY_DATA_JSON from './data/enemy-data.json';
import FUSION_CHART_JSON from '../pq/data/fusion-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import PARTY_DATA_JSON from './data/party-data.json';
import PARTY_SKILLS_JSON from './data/party-skills.json';
import BOSS_SKILLS_JSON from './data/boss-skills.json';
import DEMON_CODES_JSON from './data/demon-codes.json';
import SKILL_CODES_JSON from './data/skill-codes.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';

function createCompConfig(): CompendiumConfig {
  const resistElems = COMP_CONFIG_JSON.resistElems;
  const skillElems = resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const races = [];
  const enemyData = {};
  const inheritTypes: { [elem: string]: number } = {};

  for(const race of COMP_CONFIG_JSON.races) {
    races.push(race);
    races.push(race + ' P');
  }

  for (const [demon, entry] of Object.entries(PARTY_DATA_JSON)) {
    entry.race = entry.race + ' P';
    entry.stats = entry.stats.slice(0, 2);
    entry['fusion'] = 'party';
    entry['inherit'] = 'mag';
    DEMON_DATA_JSON[demon] = entry;
  }

  for (const [skill, entry] of Object.entries(PARTY_SKILLS_JSON)) {
    entry['unique'] = true;
    SKILL_DATA_JSON[skill] = entry;
  }

  for (const [skill, entry] of Object.entries(BOSS_SKILLS_JSON)) {
    SKILL_DATA_JSON[skill] = entry;
  }

  const COST_HP = 1 << 10;
  const COST_MP = 3 << 10;
  const COST_CC = 15 << 10;

  for (const entry of Object.values(SKILL_DATA_JSON)) {
    const cost = entry['cost'];
    const costType = cost > 1000 ? (cost > 2000 ? COST_CC - 2000 : COST_MP - 1000) : COST_HP - 200;
    entry['cost'] = cost ? cost + costType: 0;
  }

  for (const [name, enemy] of Object.entries(ENEMY_DATA_JSON)) {
    enemy['stats'] = enemy['stats'].slice(0, 3);
    enemy['ailments'] = enemy['ailments'] || '----------';
    enemy['skills'] = enemy['skills'] || [];
    enemy['drops'] = enemy['drops'] || [];

    if (enemy.race !== 'Boss') {
      enemyData[name] = enemy;
    }
  }

  for (const [code, name] of Object.entries(DEMON_CODES_JSON)) {
    DEMON_DATA_JSON[name]['code'] = parseInt(code, 10);
  }

  for (const [code, name] of Object.entries(SKILL_CODES_JSON)) {
    SKILL_DATA_JSON[name]['code'] = parseInt(code, 10);
  }

  for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
    DEMON_DATA_JSON[name]['prereq'] = prereq;
  }

  for (const [elem, inherits] of Object.entries(COMP_CONFIG_JSON.inheritTypes)) {
    inheritTypes[elem] = parseInt(inherits, 2);
  }

  return {
    appTitle: 'Persona Q2: New Cinema Labyrinth',
    races,
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    appCssClasses: ['pq2'],

    skillData: SKILL_DATA_JSON,
    skillElems,
    ailmentElems: COMP_CONFIG_JSON.ailments,
    elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    resistCodes: COMP_CONFIG_JSON.resistCodes,
    inheritTypes,
    inheritElems: COMP_CONFIG_JSON.inheritElems,

    demonData: DEMON_DATA_JSON,
    dlcData: DLC_DATA_JSON,
    baseStats: ['HP', 'MP'],
    resistElems: [],

    enemyData,
    enemyStats: ['HP', 'Atk', 'Def'],
    enemyResists: resistElems,

    demonUnlocks: DEMON_UNLOCKS_JSON,
    normalTable: FUSION_CHART_JSON,
    hasTripleFusion: true,
    specialRecipes: SPECIAL_RECIPES_JSON,

    settingsKey: 'pq2-fusion-tool-settings',
    settingsVersion: 2401131500
  };
}

const SMT_COMP_CONFIG = createCompConfig();

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
    [{ provide: COMPENDIUM_CONFIG, useValue: SMT_COMP_CONFIG }]
  ]
})
export class CompendiumModule { }
