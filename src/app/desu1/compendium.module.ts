import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../smt4f/compendium-routing.module';
import { FusionDataService } from '../smt4f/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { Smt4CompendiumModule } from '../smt4f/smt4-compendium.module';
import { CompendiumConfig, CompendiumConfigSet } from '../smt4f/models';
import { skillRowToEffect } from '../pq2/models/skill-importer';

import COMP_CONFIG_JSON from './data/comp-config.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';

import VAN_DEMON_DATA_JSON from './data/van-demon-data.json';
import VAN_SKILL_DATA_JSON from './data/van-skill-data.json';
import VAN_DEMON_UNLOCKS_JSON from './data/van-demon-unlocks.json';
import OVE_DEMON_DATA_JSON from './data/ove-demon-data.json';
import OVE_SKILL_DATA_JSON from './data/ove-skill-data.json';
import OVE_DEMON_UNLOCKS_JSON from './data/ove-demon-unlocks.json';

function estimateDesuPrice(stats: number[]): number {
  const x = stats.slice(stats.length - 4).reduce((acc, stat) => stat + acc, 0);
  return Math.floor(((-0.01171 * x + 5.0625) * x - 129) * x) + 1115;
}

function createCompConfig(): CompendiumConfigSet {
  const races = COMP_CONFIG_JSON.races;
  const resistElems = COMP_CONFIG_JSON.resistElems;
  const skillElems = resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const compConfigs: { [game: string]: CompendiumConfig } = {};
  const skillData = [];

  for (const demonJson of [VAN_DEMON_DATA_JSON, OVE_DEMON_DATA_JSON]) {
    for (const entry of Object.values(demonJson)) {
      entry['price'] = estimateDesuPrice(entry['stats']) / 2;
    }
  }

  const COST_HP = 2 << 10;
  const COST_MP = (3 << 10) - 1000;

  for (const skillJson of [VAN_SKILL_DATA_JSON, OVE_SKILL_DATA_JSON]) {
    const gameSkills = {};
    skillData.push(gameSkills);

    for (const row of Object.values(skillJson)) {
      const { a: [sname, element, target], b: nums, c: descs } = row;
      const [rank, cost] = nums.slice(0, 2);
      const card = descs[2];

      gameSkills[sname] = {
        element,
        rank,
        target: target === '-' ? 'Self' : target,
        cost: cost ? cost + (cost > 1000 ? COST_MP : COST_HP) : 0,
        effect: skillRowToEffect(nums, descs, false),
      }
    }
  }

  for (const game of ['ds1', 'dso']) {
    compConfigs[game] = {
      appTitle: 'Devil Survivor',
      races: COMP_CONFIG_JSON.races,
      raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
      appCssClasses: ['smt4', 'ds1'],

      lang: 'en',
      translations: { en: ['ja'] },
      affinityElems: [],
      skillData: skillData.slice(0, 1),
      fusionSpells: {},
      skillElems,
      elemOrder: skillElems.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
      resistCodes: COMP_CONFIG_JSON.resistCodes,
      affinityBonuses: { costs: [], upgrades: [] },
      lvlModifier: 0.5,
      hasLightDark: false,

      demonData: [VAN_DEMON_DATA_JSON],
      evolveData: {},
      alignments: {},
      baseStats: COMP_CONFIG_JSON.baseStats,
      resistElems: COMP_CONFIG_JSON.resistElems,
      ailmentElems: [],

      demonUnlocks: VAN_DEMON_UNLOCKS_JSON,
      normalTable: FUSION_CHART_JSON,
      elementTable: ELEMENT_CHART_JSON,
      specialRecipes: SPECIAL_RECIPES_JSON,

      settingsKey: 'ds1-fusion-tool-settings',
      settingsVersion: 2401131500,
      defaultRecipeDemon: 'Pixie',
      elementRace: 'Element'
    };
  }

  compConfigs.dso.appTitle = 'Devil Survivor Overclocked';
  compConfigs.dso.settingsKey = 'dso-fusion-tool-settings';
  compConfigs.dso.demonData = [VAN_DEMON_DATA_JSON, OVE_DEMON_DATA_JSON];
  compConfigs.dso.skillData = skillData;
  compConfigs.dso.demonUnlocks = VAN_DEMON_UNLOCKS_JSON.concat(<[]>OVE_DEMON_UNLOCKS_JSON);

  return {
    appTitle: 'Devil Survivor',
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    configs: compConfigs
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
