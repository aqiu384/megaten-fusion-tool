import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from './compendium-routing.module';
import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { PQCompendiumModule } from './pq-compendium.module';
import { CompendiumConfig, CompendiumConfigSet } from './models';
import { importSkillRow } from './models/skill-importer';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import ENEMY_DATA_JSON from './data/enemy-data.json';
import FUSION_CHART_JSON from '../pq/data/fusion-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import PARTY_DATA_JSON from './data/party-data.json';
import DEMON_CODES_JSON from './data/demon-codes.json';
import SKILL_CODES_JSON from './data/skill-codes.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';

function createCompConfig(): CompendiumConfigSet {
  const resistElems = COMP_CONFIG_JSON.resistElems;
  const skillElems = resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const costTypes = [1 << 10, (5 << 10) - 1000, (15 << 10) - 2000];
  const races = [];
  const skillData = {};
  const enemyData = {};
  const inheritTypes: { [elem: string]: number[] } = {};

  for (const race of COMP_CONFIG_JSON.races) {
    races.push(race);
    races.push(race + ' P');
  }

  for (const [demon, entry] of Object.entries(PARTY_DATA_JSON)) {
    entry.race = entry.race + ' P';
    entry.stats = entry.stats.slice(0, 2).map(s => s * 10);
    entry['lvl'] = entry.lvl;
    entry['fusion'] = 'party';
    entry['inherit'] = 'almpp';
    DEMON_DATA_JSON[demon] = entry;
  }

  for (const row of Object.values(SKILL_DATA_JSON)) {
    skillData[row.a[0]] = importSkillRow(row, costTypes);
  }

  for (const [code, name] of Object.entries(DEMON_CODES_JSON)) {
    DEMON_DATA_JSON[name]['code'] = parseInt(code, 10);
  }

  for (const [code, name] of Object.entries(SKILL_CODES_JSON)) {
    skillData[name]['code'] = parseInt(code, 10);
  }

  for (const demon of Object.values(DEMON_DATA_JSON)) {
    demon.stats = demon.stats.map(s => Math.floor(s / 10));
  }

  for (const [name, enemy] of Object.entries(ENEMY_DATA_JSON)) {
    const stats = enemy['stats'];
    enemy['stats'] = [stats[0], stats[1] * 3, stats[3] * 3];
    enemy['drops'] = Object.keys(enemy['dodds']);
    enemy['resists'] = enemy['resists'].slice(0, 9);
    if (enemy['race'] !== 'Boss') { enemyData[name] = enemy; }
  }

  for (const [elem, inherits] of Object.entries(COMP_CONFIG_JSON.inheritTypes)) {
    inheritTypes[elem] = inherits.split('').map(n => n === '1' ? 1 : 0);
  }

  const compConfig: CompendiumConfig = {
    appTitle: 'Persona Q2: New Cinema Labyrinth',
    lang: 'en',
    races,
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    appCssClasses: ['pq2'],

    skillData: [skillData],
    skillElems,
    ailmentElems: COMP_CONFIG_JSON.ailments,
    elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    resistCodes: COMP_CONFIG_JSON.resistCodes,

    demonData: [DEMON_DATA_JSON],
    baseStats: ['HP', 'MP'],
    resistElems,
    inheritTypes,
    inheritElems: COMP_CONFIG_JSON.inheritElems,

    demonUnlocks: DEMON_UNLOCKS_JSON,
    enemyData: [enemyData],
    enemyStats: ['HP', 'Atk', 'Def'],

    normalTable: FUSION_CHART_JSON,
    elementTable: { elems: [], races: [], table: [] },
    specialRecipes: SPECIAL_RECIPES_JSON,
    maxSkillSlots: 6,
    hasTripleFusion: true,
    hasDemonResists: false,
    hasSkillRanks: false,
    hasEnemies: true,
    hasQrcodes: true,
    hasSkillCards: true,
    hasManualInheritance: true,

    defaultDemon: 'Pixie',
    settingsKey: 'pq2-fusion-tool-settings',
    settingsVersion: 2405151000
  };

  return {
    appTitle: 'Persona Q2: New Cinema Labyrinth',
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    configs: { 'pq2': compConfig }
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
