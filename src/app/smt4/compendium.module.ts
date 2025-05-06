import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../smt4f/compendium-routing.module';
import { FusionDataService } from '../smt4f/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { Smt4CompendiumModule } from '../smt4f/smt4-compendium.module';
import { CompendiumConfig } from '../smt4f/models';
import { skillRowToEffect } from '../pq2/models/skill-importer';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import ENEMY_DATA_JSON from './data/enemy-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import EVOLUTIONS_JSON from './data/evolutions.json';
import ALIGNMENTS_JSON from './data/alignments.json';
import JA_NAMES_JSON from '../smt4/data/ja-names.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';

function updateComputedDemon(entry, skillPrices, compConfig) {
  const stats = entry.stats;
  const lvl = Math.floor(entry.lvl);
  const hp = stats[0] + lvl * stats[2];
  const mp = Math.floor(0.45 * (stats[1] + lvl * stats[3]));
  entry.stats = [hp, mp].concat(stats.slice(4));

  const hpPrice = Math.floor((hp / 2) ** 1.5);
  const mpPrice = Math.floor((mp / 2) ** 1.5);
  const statPrice = Math.floor((entry.stats.slice(2).reduce((acc, i) => acc + i, 0)) ** 1.5);
  const baseSkills = Object.keys(entry.skills).filter(s => entry.skills[s] < 2);
  const skillPrice = baseSkills.reduce((acc, i) => acc + skillPrices[i], 0);
  const baseResists = entry.resists.split('').map(r => Math.floor(compConfig.resistCodes[r] / 1000));
  const resistPrice = lvl * baseResists.reduce((acc, i) => acc + compConfig.resistRankPrices[i], 0) ** 2;
  entry.price = hpPrice + mpPrice + statPrice + skillPrice + resistPrice;
  entry.price = Math.floor(entry.price / 2);
}

function createCompConfig(): CompendiumConfig {
  const translations = Object.entries(JA_NAMES_JSON).reduce((acc, [ja, en]) => { acc[en] = [ja]; return acc }, { en: ['ja'] });
  const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const skillData = {};
  const skillPrices = {};

  for (const { a, b } of Object.values(SKILL_DATA_JSON)) {
    const rank = b[0] > 900 ? b[0] - 900 : b[0] === 99 ? 0 : b[0];
    skillPrices[a[0]] = COMP_CONFIG_JSON.skillRankPrices[rank];
  }

  for (const entry of Object.values(DEMON_DATA_JSON)) {
    updateComputedDemon(entry, skillPrices, COMP_CONFIG_JSON);
  }

  for (const [demon, entry] of Object.entries(ENEMY_DATA_JSON)) {
    entry['skills'] = entry['eskills'].reduce((acc, s) => { acc[s] = 0; return acc; }, {});
    entry['fusion'] = 'enemy';
    entry['prereq'] = 'Enemy Only';
    entry['price'] = 0;
    DEMON_DATA_JSON[demon] = entry;
  }

  const COST_MP = (3 << 10) - 1000;

  for (const row of Object.values(SKILL_DATA_JSON)) {
    const { a: [sname, elem, target], b: nums, c: descs } = row;
    const [rank, cost, power, minHits, maxHits, acc, crit, mod] = nums;
    nums[2] = Math.round(2 * power / (minHits + maxHits));
    nums[5] = acc === 120 ? 110 : acc;

    skillData[sname] = {
      element: elem,
      rank: Math.min(rank, 99),
      target: target === '-' ? 'Self' : target,
      cost: cost === 0 ? 0 : cost + COST_MP,
      effect: skillRowToEffect(nums, descs, false),
    }
  }

  for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
    DEMON_DATA_JSON[name].prereq = prereq;
    DEMON_DATA_JSON[name].fusion = prereq.includes('Fusion Accident') ? 'accident' : 'normal';
  }

  return {
    appTitle: 'Shin Megami Tensei IV',
    races: COMP_CONFIG_JSON.races,
    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    appCssClasses: ['smt4', 'smt4f'],

    lang: 'en',
    translations,
    affinityElems: [],
    skillData: [skillData],
    fusionSpells: {},
    skillElems,
    elemOrder: skillElems.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    resistCodes: COMP_CONFIG_JSON.resistCodes,
    affinityBonuses: { costs: [], upgrades: [] },
    lvlModifier: 1,

    demonData: [DEMON_DATA_JSON],
    evolveData: EVOLUTIONS_JSON,
    alignments: ALIGNMENTS_JSON,
    baseStats: COMP_CONFIG_JSON.baseStats,
    resistElems: COMP_CONFIG_JSON.resistElems,
    ailmentElems: COMP_CONFIG_JSON.ailments,

    demonUnlocks: DEMON_UNLOCKS_JSON,
    normalTable: FUSION_CHART_JSON,
    elementTable: ELEMENT_CHART_JSON,
    specialRecipes: SPECIAL_RECIPES_JSON,

    settingsKey: 'smt4-fusion-tool-settings',
    settingsVersion: 2401131500,
    defaultRecipeDemon: 'Pixie',
    elementRace: 'Element'
  }
}

const SMT_COMP_CONFIG = createCompConfig();

@NgModule({
  imports: [
    CommonModule,
    Smt4CompendiumModule,
    CompendiumRoutingModule
  ],
  providers: [
    Title,
    FusionDataService,
    [{ provide: FUSION_DATA_SERVICE, useExisting: FusionDataService }],
    [{ provide: COMPENDIUM_CONFIG, useValue: SMT_COMP_CONFIG }]
  ]
})
export class CompendiumModule { }
