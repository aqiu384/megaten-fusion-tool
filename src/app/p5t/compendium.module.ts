import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../pq2/compendium-routing.module';
import { FusionDataService } from '../pq2/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { PQCompendiumModule } from '../pq2/pq-compendium.module';
import { CompendiumConfig, CompendiumConfigSet } from '../pq2/models';
import { skillRowToEffect } from '../pq2/models/skill-importer';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import DLC_DATA_JSON from './data/dlc-data.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';

function estimatePrice(stats: number[]) {
  const statSum = 1.5*stats[0] + 1*stats[1] + 0.75*stats[2] + 0.75*stats[3];
  const price = 1164 + -2.29*statSum + 0.075*statSum**2;
  return Math.floor(price);
}

function createCompConfig(): CompendiumConfigSet {
  const resistElems = COMP_CONFIG_JSON.resistElems;
  const skillElems = resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const races = [];
  const skillData = {};
  const inheritTypes: { [elem: string]: number[] } = {};

  for(const race of COMP_CONFIG_JSON.races) {
    races.push(race);
    races.push(race + ' P');
  }

  for (const demon of Object.values(DEMON_DATA_JSON)) {
    demon['code'] = 1;
    demon['inherit'] = 'alm';
    demon['skills'] = {};
    demon['skills'][demon.skill] = 0.1;
    demon['price'] = estimatePrice(demon.stats);
  }

  for (const demon of Object.values(DLC_DATA_JSON)) {
    demon['inherit'] = 'alm';
    demon['skills'] = {};
    demon['skills'][demon.skill] = 0.1;
    demon['price'] = estimatePrice(demon.stats);
  }

  const COST_MP = 5 << 10;
  const COST_MAG = 19 << 10;

  for (const row of Object.values(SKILL_DATA_JSON)) {
    const { a: [sname, elem, target], b: nums, c: descs } = row;
    const [rank, cost, power, minHits, maxHits, acc, crit, mod] = nums;

    skillData[sname] = {
      element: elem,
      rank: Math.min(Math.floor(rank / 5) + 1, 99),
      target: target === '-' ? 'Self' : target,
      cost: cost === 0 ? 0 : cost < 1000 ? cost + COST_MP : COST_MAG,
      effect: skillRowToEffect(nums, descs, false),
      code: 1
    };
  }

  for (const [elem, inherits] of Object.entries(COMP_CONFIG_JSON.inheritTypes)) {
    inheritTypes[elem] = inherits.split('').map(n => n === '1' ? 1 : 0);
  }

  const compConfig: CompendiumConfig = {
    appTitle: 'Persona 5 Tactica',
    lang: 'en',
    races,
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    appCssClasses: ['p5t'],

    skillData: [skillData],
    skillElems,
    ailmentElems: COMP_CONFIG_JSON.ailments,
    elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    resistCodes: COMP_CONFIG_JSON.resistCodes,

    demonData: [Object.assign(DEMON_DATA_JSON, DLC_DATA_JSON)],
    baseStats: ['HP', 'MP', 'MD', 'GD'],
    resistElems,
    inheritTypes,
    inheritElems: [],

    enemyData: [],
    enemyStats: ['HP', 'Atk', 'Def'],

    demonUnlocks: DEMON_UNLOCKS_JSON,
    normalTable: FUSION_CHART_JSON,
    elementTable: { elems: [], races: [], table: [] },
    specialRecipes: SPECIAL_RECIPES_JSON,
    maxSkillSlots: 2,
    hasTripleFusion: false,
    hasDemonResists: false,
    hasSkillRanks: false,
    hasEnemies: false,
    hasQrcodes: false,
    hasSkillCards: false,
    hasManualInheritance: true,

    defaultDemon: 'Pixie',
    settingsKey: 'p5t-fusion-tool-settings',
    settingsVersion: 2401131500
  };

  return {
    appTitle: 'Persona 5 Tactica',
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    configs: { 'p5t': compConfig }
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
    [{ provide: COMPENDIUM_CONFIG, useValue: SMT_COMP_CONFIG }],
  ]
})
export class CompendiumModule { }
