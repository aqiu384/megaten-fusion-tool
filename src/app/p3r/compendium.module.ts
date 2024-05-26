import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { CompendiumRoutingModule } from '../pq2/compendium-routing.module';
import { FusionDataService } from '../pq2/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { PQCompendiumModule } from '../pq2/pq-compendium.module';
import { CompendiumConfig } from '../pq2/models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import PARTY_DATA_JSON from './data/party-data.json';
import ENEMY_DATA_JSON from './data/enemy-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import ZHCN_NAMES from './data/zhcn-names.json';
import { translateDemonData, translateDemonUnlocks, translateFusionChart, translateSkillData, translateSpecialRecipes } from '../compendium/models/translator';
import { PageTranslationUtil } from '../page-translations/page-translation-util';

function createCompConfig(url: string): CompendiumConfig {
  let lang = PageTranslationUtil.getLanguage(url);
  var foreignNames: { [foreignName: string]: string };
  if (lang == 'zh-cn') {
    foreignNames = ZHCN_NAMES;
  }

  const resistElems = COMP_CONFIG_JSON.resistElems;
  const skillElems = resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const races = [];
  const inheritTypes: { [elem: string]: number } = {};
  const enemyData = {}

  for (var race of COMP_CONFIG_JSON.races) {
    if (foreignNames && race in foreignNames) {
      race = foreignNames[race]
    }
    races.push(race);
    races.push(race + ' P');
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
    enemy['drops'] = Object.keys(enemy['drops'] || {});
    if (!enemy['boss']) { enemyData[name] = enemy; }
  }

  const COST_HP = 2 << 10;
  const COST_MP = 3 << 10;
  const COST_THEURGY = 19 << 10;

  for (const entry of Object.values(SKILL_DATA_JSON)) {
    const cost = entry['cost'];
    const costType = cost > 1000 ? COST_MP - 1000 : COST_HP;
    entry['cost'] = cost ? (cost > 2000 ? COST_THEURGY : cost + costType) : 0;
    if (entry['card']) { entry['card'] = 'Sword ' + entry['card']; }
    if (entry['mutate']) { entry['card'] = 'Skill Mutation'; }

    const effect = [];
    if (entry['power']) { effect.push(`√${entry['power']} power`); }
    if (entry['min']) { effect.push(`${entry['min']}${entry['max'] && entry['max'] != entry['min'] ? '-' + entry['max'] : ''} hits`); }
    if (entry['hit'] && entry['hit'] < 90) { effect.push(`${entry['hit']}% hit`); }
    if (entry['crit'] && entry['crit'] > 10) { effect.push(`${entry['crit']}% crit`); }

    if (entry['mod']) {
      const mod = entry['mod'];
      const add = entry['add'];
      effect.push(mod < 1000 ? `${mod}% ${add}` : `x${(mod / 100 - 10).toFixed(2)} ${add}`);
    } else if (entry['add']) {
      effect.push(entry['add']);
    }

    entry['effect'] = effect.length > 0 ? effect.join(', ') : entry['effect'];
  }

  for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
    DEMON_DATA_JSON[name]['prereq'] = prereq;
  }

  for (const [elem, inherits] of Object.entries(COMP_CONFIG_JSON.inheritTypes)) {
    inheritTypes[elem] = parseInt(inherits, 2);
  }

  return {
    appTitle: 'Persona 3 Reload',
    races,
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    appCssClasses: ['p3r'],

    skillData: lang == 'en' ? SKILL_DATA_JSON : translateSkillData(SKILL_DATA_JSON, foreignNames),
    skillElems,
    ailmentElems: COMP_CONFIG_JSON.ailments.map(x => x.slice(0, 3)),
    elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    resistCodes: COMP_CONFIG_JSON.resistCodes,

    demonData: lang == 'en' ? DEMON_DATA_JSON : translateDemonData(DEMON_DATA_JSON, foreignNames),
    baseStats: COMP_CONFIG_JSON.baseStats,
    resistElems,
    inheritTypes,
    inheritElems: COMP_CONFIG_JSON.inheritElems,

    demonUnlocks: lang == 'en' ? DEMON_UNLOCKS_JSON : translateDemonUnlocks(DEMON_UNLOCKS_JSON, foreignNames),
    enemyData,
    enemyStats: ['HP', 'MP'],

    normalTable: lang == 'en' ? FUSION_CHART_JSON : translateFusionChart(FUSION_CHART_JSON, foreignNames),
    hasTripleFusion: false,
    hasDemonResists: true,
    hasSkillRanks: true,
    hasEnemies: true,
    hasQrcodes: false,
    specialRecipes: lang == 'en' ? SPECIAL_RECIPES_JSON : translateSpecialRecipes(SPECIAL_RECIPES_JSON, foreignNames),

    settingsKey: 'p3r-fusion-tool-settings',
    settingsVersion: 2401131500,

    defaultDemon: foreignNames == null ? 'Pixie' : foreignNames['Pixie']
  };
}

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
    [{
      provide: COMPENDIUM_CONFIG,
      useFactory: (router: Router) => {
        return createCompConfig(router.url)
      },
      deps: [Router]
    }],
  ]
})
export class CompendiumModule { }
