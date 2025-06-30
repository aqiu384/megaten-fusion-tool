import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from './compendium-routing.module';
import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { Smt4CompendiumModule } from './smt4-compendium.module';
import { CompendiumConfig, CompendiumConfigSet } from './models';
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
import ALIGNMENTS_JSON from '../smt4/data/alignments.json';
import AFFINITIES_JSON from './data/affinity-bonuses.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';

function updateComputedDemon(entry, skillPrices, compConfig) {
  const stats = entry.stats;
  const lvl = Math.floor(entry.lvl);
  const hp = stats[0] + (lvl - 1) * stats[2];
  const mp = stats[1] + (lvl - 1) * COMP_CONFIG_JSON.mpGrows[stats[3]]
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

function createCompConfig(): CompendiumConfigSet {
  const affinityElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.affinityElems);
  const skillElems = affinityElems.concat(COMP_CONFIG_JSON.skillElems);
  const affinityBonuses: { costs: number[][], upgrades: number[][] } = { costs: [], upgrades: [] };
  const skillData = {};
  const skillPrices = {};

  for (const { a, b } of Object.values(SKILL_DATA_JSON)) {
    const rank = b[0] > 900 ? b[0] - 900 : b[0] === 99 ? 0 : b[0];
    skillPrices[a[0]] = COMP_CONFIG_JSON.skillRankPrices[rank];
  }

  for (const entry of Object.values(DEMON_DATA_JSON)) {
    updateComputedDemon(entry, skillPrices, COMP_CONFIG_JSON);
  }

  DEMON_DATA_JSON['Satan'].stats = [1253, 722].concat(DEMON_DATA_JSON['Satan'].stats.slice(2));
  const COST_MP = (3 << 10) - 1000;

  for (const row of Object.values(SKILL_DATA_JSON)) {
    const { a: [sname, elem, target], b: nums, c: descs } = row;
    const [rank, cost, power, minHits, maxHits, acc, crit, mod] = nums;
    nums[5] = acc === 120 ? 110 : acc;

    skillData[sname] = {
      element: elem,
      rank: Math.min(rank, 99),
      target: target === '-' ? 'Self' : target,
      cost: cost === 0 ? 0 : cost + COST_MP,
      effect: skillRowToEffect(nums, descs, false),
    }
  }

  for (const [demon, entry] of Object.entries(ENEMY_DATA_JSON)) {
    entry['skills'] = entry['eskills'].reduce((acc, s) => { acc[s] = 0; return acc; }, {});
    entry['fusion'] = 'enemy';
    entry['prereq'] = 'Enemy Only';
    entry['price'] = 0;
    DEMON_DATA_JSON[demon] = entry;
  }

  for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
    DEMON_DATA_JSON[name].prereq = prereq;
    DEMON_DATA_JSON[name].fusion = prereq.includes('Fusion Accident') ? 'accident' : 'normal';
  }

  for (const elem of affinityElems) {
    const bonusElem = AFFINITIES_JSON.elements[elem];
    affinityBonuses.costs.push(AFFINITIES_JSON.costs[bonusElem]);
    affinityBonuses.upgrades.push(AFFINITIES_JSON.upgrades[bonusElem]);
  }

  const compConfig: CompendiumConfig = {
    appTitle: 'Shin Megami Tensei IV Apocalypse',
    races: COMP_CONFIG_JSON.races,
    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    appCssClasses: ['smt4', 'smt4f'],

    lang: 'en',
    affinityElems,
    skillData: [skillData],
    fusionSpells: {},
    skillElems,
    elemOrder: skillElems.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    resistCodes: COMP_CONFIG_JSON.resistCodes,
    affinityBonuses,
    lvlModifier: 1,
    maxSkillSlots: 8,
    hasLightDark: true,
    hasSkillRanks: true,
    hasNonelemInheritance: false,

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

    settingsKey: 'smt4f-fusion-tool-settings',
    settingsVersion: 2503061400,
    defaultRecipeDemon: 'Pixie',
    elementRace: 'Element'
  };

  return {
    appTitle: 'Shin Megami Tensei IV Apocalypse',
    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    configs: { 'smt4f': compConfig }
  };
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
