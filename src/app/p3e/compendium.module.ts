import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../pq2/compendium-routing.module';
import { FusionDataService } from '../pq2/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { PQCompendiumModule } from '../pq2/pq-compendium.module';
import { CompendiumConfig } from '../pq2/models';
import { importSkillRow } from '../pq2/models/skill-importer';

import COMP_CONFIG_JSON from '../p3r/data/comp-config.json';
import TRANSLATIONS_JSON from '../p3r/data/translations.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';
import DEMON_DATA_JSON from '../p3r/data/demon-data.json';
import PARTY_DATA_JSON from '../p3r/data/party-data.json';
import ENEMY_DATA_JSON from '../p3r/data/enemy-data.json';
import SKILL_DATA_JSON from '../p3r/data/skill-data.json';
import FUSION_CHART_JSON from '../p3r/data/fusion-chart.json';
import SPECIAL_RECIPES_JSON from '../p3r/data/special-recipes.json';
import FUSION_PREREQS_JSON from '../p3r/data/fusion-prereqs.json';

function createCompConfig(): CompendiumConfig {
  const resistElems = COMP_CONFIG_JSON.resistElems;
  const skillElems = resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const costTypes = [2 << 10, (5 << 10) - 1000, (19 << 10) - 2001];
  const races = [];
  const allRaces = [];
  const inheritTypes: { [elem: string]: number } = {};
  const enemyData = {};
  const skillData = {};

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

  Object.assign(DEMON_DATA_JSON, PARTY_DATA_JSON);
  const estimatePrice = (stats: number[]) => 2000 + stats.reduce((acc, x) => acc + x, 0) ** 2;

  for (const demon of Object.values(DEMON_DATA_JSON)) {
    demon['code'] = 1;
    demon['price'] = estimatePrice(demon['stats']);
  }

  for (const demon of Object.values(PARTY_DATA_JSON)) {
    demon['fusion'] = 'party';
    demon['price'] = estimatePrice(demon['stats']);
  }

  for (const [name, enemy] of Object.entries(ENEMY_DATA_JSON)) {
    enemy['stats'] = enemy['stats'].slice(0, 2);
    enemy['drops'] = Object.keys(enemy['dodds'] || {});
    if (!enemy['boss']) { enemyData[name] = enemy; }
  }

  for (const row of Object.values(SKILL_DATA_JSON)) {
    row.b[0] = row.b[0] || 99;
    skillData[row.a[0]] = importSkillRow(row, costTypes);
  }

  for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
    DEMON_DATA_JSON[name]['prereq'] = prereq;
  }

  for (const [elem, inherits] of Object.entries(COMP_CONFIG_JSON.inheritTypes)) {
    inheritTypes[elem] = parseInt(inherits, 2);
  }

  return {
    appTitle: 'Persona 3 Reload: Episode Aigis',
    translations: TRANSLATIONS_JSON,
    lang: 'en',
    races,
    raceOrder: allRaces.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    appCssClasses: ['p3r'],

    skillData,
    skillElems,
    ailmentElems: COMP_CONFIG_JSON.ailments.map(x => x.slice(0, 3)),
    elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    resistCodes: COMP_CONFIG_JSON.resistCodes,

    demonData: DEMON_DATA_JSON,
    baseStats: COMP_CONFIG_JSON.baseStats,
    resistElems,
    inheritTypes,
    inheritElems: COMP_CONFIG_JSON.inheritElems,

    demonUnlocks: DEMON_UNLOCKS_JSON,
    enemyData,
    enemyStats: ['HP', 'MP'],

    normalTable: FUSION_CHART_JSON,
    hasTripleFusion: false,
    hasDemonResists: true,
    hasSkillRanks: true,
    hasEnemies: true,
    hasQrcodes: false,
    specialRecipes: SPECIAL_RECIPES_JSON,

    defaultDemon: 'Pixie',
    settingsKey: 'p3e-fusion-tool-settings',
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
    [{ provide: COMPENDIUM_CONFIG, useValue: SMT_COMP_CONFIG }],
  ]
})
export class CompendiumModule { }
