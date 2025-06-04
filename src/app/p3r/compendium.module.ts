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
import TRANSLATIONS_JSON from './data/translations.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import PARTY_DATA_JSON from './data/party-data.json';
import ENEMY_DATA_JSON from './data/enemy-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';

import AEG_DEMON_DATA_JSON from './data/aeg-demon-data.json';
import AEG_PARTY_DATA_JSON from './data/aeg-party-data.json'
import AEG_ENEMY_DATA_JSON from './data/aeg-enemy-data.json';
import AEG_SKILL_DATA_JSON from './data/aeg-skill-data.json';
import AEG_DEMON_UNLOCKS_JSON from './data/aeg-demon-unlocks.json';

function createCompConfig(): CompendiumConfigSet {
  const resistElems = COMP_CONFIG_JSON.resistElems;
  const skillElems = resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const costTypes = [2 << 10, (5 << 10) - 1000, (19 << 10) - 2001];
  const races = [];
  const allRaces = [];
  const inheritTypes: { [elem: string]: number[] } = {};
  const enemyDatas = [];
  const skillDatas = [];
  const compConfigs: { [game: string]: CompendiumConfig } = {};

  for (const enRace of COMP_CONFIG_JSON.races) {
    const penRace = enRace + ' P';
    races.push(enRace);
    races.push(penRace);
    allRaces.push(enRace);
    allRaces.push(penRace);
    TRANSLATIONS_JSON[penRace] = [];
    for (const langRace of TRANSLATIONS_JSON[enRace]) {
      allRaces.push(langRace);
      allRaces.push(langRace + 'P');
      TRANSLATIONS_JSON[penRace].push(langRace + 'P');
    }
  }

  const gameDataSets = [
    [DEMON_DATA_JSON, PARTY_DATA_JSON],
    [AEG_DEMON_DATA_JSON, AEG_PARTY_DATA_JSON]
  ]

  for (const [demons, parties] of gameDataSets) {
    Object.assign(demons, parties);
    const estimatePrice = (stats: number[]) => 2000 + stats.reduce((acc, x) => acc + x, 0) ** 2;

    for (const demon of Object.values(demons)) {
      demon['code'] = 1;
      demon['price'] = estimatePrice(demon['stats']);
    }

    for (const demon of Object.values(parties)) {
      demon['fusion'] = 'party';
      demon['price'] = estimatePrice(demon['stats']);
    }
  }

  for (const enemies of [ENEMY_DATA_JSON, AEG_ENEMY_DATA_JSON]) {
    const enemyData = {};
    for (const [name, enemy] of Object.entries(enemies)) {
      enemy['stats'] = enemy['stats'].slice(0, 2);
      enemy['drops'] = Object.keys(enemy['dodds'] || {});
      if (!enemy['boss']) { enemyData[name] = enemy; }
    }
    enemyDatas.push(enemyData);
  }

  for (const skills of [SKILL_DATA_JSON, AEG_SKILL_DATA_JSON]) {
    const skillData = {};
    for (const row of Object.values(skills)) {
      row.b[0] = row.b[0] || 99;
      skillData[row.a[0]] = importSkillRow(row, costTypes);
    }
    skillDatas.push(skillData)
  }

  for (const [elem, inherits] of Object.entries(COMP_CONFIG_JSON.inheritTypes)) {
    inheritTypes[elem] = inherits.split('').map(n => n === '1' ? 1 : 0);
  }

  for (const game of ['p3r', 'p3e']) {
    compConfigs[game] = {
      appTitle: 'Persona 3 Reload',
      translations: TRANSLATIONS_JSON,
      lang: 'en',
      races,
      raceOrder: allRaces.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
      appCssClasses: ['p3r'],

      skillData: skillDatas.slice(0, 1),
      skillElems,
      ailmentElems: COMP_CONFIG_JSON.ailments.map(x => x.slice(0, 3)),
      elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
      resistCodes: COMP_CONFIG_JSON.resistCodes,

      demonData: [DEMON_DATA_JSON],
      baseStats: COMP_CONFIG_JSON.baseStats,
      resistElems,
      inheritTypes,
      inheritElems: COMP_CONFIG_JSON.inheritElems,

      demonUnlocks: DEMON_UNLOCKS_JSON,
      enemyData: enemyDatas.slice(0, 1),
      enemyStats: ['HP', 'MP'],

      normalTable: FUSION_CHART_JSON,
      hasTripleFusion: false,
      hasDemonResists: true,
      hasSkillRanks: true,
      hasEnemies: true,
      hasQrcodes: false,
      hasSkillCards: true,
      hasManualInheritance: true,
      specialRecipes: SPECIAL_RECIPES_JSON,

      defaultDemon: 'Pixie',
      settingsKey: 'p3r-fusion-tool-settings',
      settingsVersion: 2401131500
    };
  }

  compConfigs.p3e.appTitle = 'Persona 3 Reload: Episode Aigis';
  compConfigs.p3e.settingsKey = 'p3e-fusion-tool-settings';
  compConfigs.p3e.demonData = [AEG_DEMON_DATA_JSON];
  compConfigs.p3e.skillData = skillDatas.slice(0, 2);
  compConfigs.p3e.enemyData = enemyDatas.slice(1, 2);
  compConfigs.p3e.demonUnlocks = AEG_DEMON_UNLOCKS_JSON;

  return {
    appTitle: 'Persona 3 Reload',
    raceOrder: allRaces.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
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
