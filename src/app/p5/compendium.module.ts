import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../pq2/compendium-routing.module';
import { FusionDataService } from '../pq2/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { PQCompendiumModule } from '../pq2/pq-compendium.module';
import { CompendiumConfig, CompendiumConfigSet } from '../pq2/models';
import { importSkillRow } from '../pq2/models/skill-importer';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import DLC_DATA_JSON from './data/dlc-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import ENEMY_DATA_JSON from './data/enemy-data.json';
import PARTY_DATA_JSON from './data/party-data.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';

import ROY_DEMON_DATA_JSON from './data/roy-demon-data.json';
import ROY_DLC_DATA_JSON from './data/roy-dlc-data.json';
import ROY_SKILL_DATA_JSON from './data/roy-skill-data.json';
import ROY_ENEMY_DATA_JSON from './data/roy-enemy-data.json';
import ROY_PARTY_DATA_JSON from './data/roy-party-data.json';
import ROY_DEMON_UNLOCKS_JSON from './data/roy-demon-unlocks.json';
import ROY_SPECIAL_RECIPES_JSON from './data/roy-special-recipes.json';
import ROY_FUSION_PREREQS_JSON from './data/roy-fusion-prereqs.json';
import ROY_FUSION_CHART_JSON from './data/roy-fusion-chart.json';
import ROY_ELEMENT_CHART_JSON from './data/roy-element-chart.json';

function createCompConfig(): CompendiumConfigSet {
  const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const costTypes = [2 << 10, (5 << 10) - 1000, (15 << 10) - 2000];
  const races = [];
  const skillDatas = [];
  const inheritTypes: { [elem: string]: number[] } = {};
  const compConfigs: { [game: string]: CompendiumConfig } = {};

  for(const race of COMP_CONFIG_JSON.races) {
    races.push(race);
    races.push(race + ' P');
  }

  const gameDataSets = [
    [DEMON_DATA_JSON, DLC_DATA_JSON, PARTY_DATA_JSON, FUSION_PREREQS_JSON],
    [ROY_DEMON_DATA_JSON, ROY_DLC_DATA_JSON, ROY_PARTY_DATA_JSON, ROY_FUSION_PREREQS_JSON]
  ]

  for (const [demons, dlc, parties, prereqs] of gameDataSets) {
    Object.assign(demons, dlc, parties);
    const estimatePrice = (stats: number[]) => 2000 + stats.reduce((acc, x) => acc + x, 0) ** 2;

    for (const [name, demon] of Object.entries(demons)) {
      demon['code'] = 1;
      demon['price'] = estimatePrice(demon['stats']);

      if (demon['itemr']) {
        demon['item'] = `${demon['item']}, ${demon['itemr']}`;
      }
    }

    for (const [name, prereq] of Object.entries(prereqs)) {
      demons[name].prereq = prereq;
    }

    for (const demon of Object.values(parties)) {
      demon['fusion'] = 'party';
      demon['price'] = estimatePrice(demon['stats']);
    }
  }

  const ailmendInds = [2, 3, 4, 8, 9, 10, 12, 17, 18, 19];
  const ailmentElems = [
    'Burn', 'Freeze', 'Shock', 'Hama', 'Mudo',
    'Dizzy', 'Fear', 'Despair', 'Brainwash', 'Other'
  ].map(x => x.slice(0, 4));

  for (const enemies of [ENEMY_DATA_JSON, ROY_ENEMY_DATA_JSON]) {
    for (const enemy of Object.values(enemies)) {
      const baseAilments = enemy['ailments'] || '---------';
      const allAilments = enemy['resists'] + baseAilments + (baseAilments === 'AAAAAAAAA' ? 'A' : '-');
      enemy['ailments'] = ailmendInds
        .map(x => 64 < allAilments.charCodeAt(x) && allAilments.charCodeAt(x) < 96 ? '_' : '-')
        .join('');
      enemy['area'] = enemy['area'] || [enemy['areas']];
      enemy['stats'] = enemy['stats'].slice(0, 2);
      enemy['drops'] = [enemy['material'] || '-', enemy['armor'] || '-', enemy['card'] || '-'].filter(d => d !== '-');
    }
  }

  for (const skills of [SKILL_DATA_JSON, ROY_SKILL_DATA_JSON]) {
    const skillData = {};
    skillDatas.push(skillData)
    for (const row of Object.values(skills)) {
      row.b[0] = row.b[0] || 99;
      skillData[row.a[0]] = importSkillRow(row, costTypes);
    }
  }

  for (const [elem, inherits] of Object.entries(COMP_CONFIG_JSON.inheritTypes)) {
    inheritTypes[elem] = inherits.split('').map(n => n === '1' ? 1 : 0);
  }

  for (const game of ['p5', 'p5r']) {
    compConfigs[game] = {
      appTitle: 'Persona 5',
      lang: 'en',
      races,
      raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
      appCssClasses: ['p5'],

      skillData: skillDatas.slice(0, 1),
      skillElems,
      ailmentElems,
      elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
      resistCodes: COMP_CONFIG_JSON.resistCodes,

      demonData: [DEMON_DATA_JSON],
      baseStats: COMP_CONFIG_JSON.baseStats,
      resistElems: COMP_CONFIG_JSON.resistElems,
      inheritTypes,
      inheritElems: COMP_CONFIG_JSON.inheritElems,

      demonUnlocks: DEMON_UNLOCKS_JSON,
      enemyData: [ENEMY_DATA_JSON],
      enemyStats: ['HP', 'MP'],

      normalTable: FUSION_CHART_JSON,
      elementTable: ELEMENT_CHART_JSON,
      specialRecipes: SPECIAL_RECIPES_JSON,
      maxSkillSlots: 8,
      hasTripleFusion: false,
      hasDemonResists: true,
      hasSkillRanks: true,
      hasEnemies: true,
      hasQrcodes: false,
      hasSkillCards: true,
      hasManualInheritance: true,

      defaultDemon: 'Pixie',
      settingsKey: 'p5-fusion-tool-settings',
      settingsVersion: 2506051800
    };
  }

  compConfigs.p5r.appTitle = 'Persona 5 Royal';
  compConfigs.p5r.appCssClasses = ['p5', 'p5r'];
  compConfigs.p5r.settingsKey = 'p5r-fusion-tool-settings';
  compConfigs.p5r.demonData = [ROY_DEMON_DATA_JSON];
  compConfigs.p5r.enemyData = [ROY_ENEMY_DATA_JSON];
  compConfigs.p5r.skillData = skillDatas;
  compConfigs.p5r.specialRecipes = ROY_SPECIAL_RECIPES_JSON;
  compConfigs.p5r.demonUnlocks = ROY_DEMON_UNLOCKS_JSON;
  compConfigs.p5r.normalTable = ROY_FUSION_CHART_JSON;
  compConfigs.p5r.elementTable = ROY_ELEMENT_CHART_JSON;
  compConfigs.p5r.maxSkillSlots = 9;

  return {
    appTitle: 'Persona 5',
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    configs: compConfigs
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
