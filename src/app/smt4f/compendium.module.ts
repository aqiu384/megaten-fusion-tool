import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from './compendium-routing.module';
import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { Smt4CompendiumModule } from './smt4-compendium.module';
import { CompendiumConfig } from './models';
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
import JA_NAMES_JSON from '../smt4/data/ja-names.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';

function createCompConfig(): CompendiumConfig {
  const affinityElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.affinityElems);
  const skillElems = affinityElems.concat(COMP_CONFIG_JSON.skillElems);
  const affinityBonuses: { costs: number[][], upgrades: number[][] } = { costs: [], upgrades: [] };
  const mpGrows = [0, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 4, 5]
  const skillData = {};

  for (const entry of Object.values(DEMON_DATA_JSON)) {
    const stats = entry.stats;
    const lvl = Math.floor(entry.lvl) - 1;
    const hp = stats[0] + lvl * stats[2];
    const mp = stats[1] + lvl * mpGrows[stats[3]]
    entry.stats = [hp, mp].concat(stats.slice(4));
  }

  DEMON_DATA_JSON['Satan'].stats = [1253, 722].concat(DEMON_DATA_JSON['Satan'].stats.slice(2));
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

  return {
    appTitle: 'Shin Megami Tensei IV Apocalypse',
    races: COMP_CONFIG_JSON.races,
    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    appCssClasses: ['smt4', 'smt4f'],

    lang: 'en',
    jaNames: JA_NAMES_JSON,
    affinityElems,
    skillData: [skillData],
    fusionSpells: {},
    skillElems,
    elemOrder: skillElems.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    resistCodes: COMP_CONFIG_JSON.resistCodes,
    affinityBonuses,
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

    settingsKey: 'smt4f-fusion-tool-settings',
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
