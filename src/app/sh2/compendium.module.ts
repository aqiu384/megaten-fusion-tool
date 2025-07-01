import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../smt4f/compendium-routing.module';
import { FusionDataService } from '../smt4f/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { Smt4CompendiumModule } from '../smt4f/smt4-compendium.module';
import { CompendiumConfig, CompendiumConfigSet } from '../smt4f/models';
import { skillRowToEffect } from '../pq2/models/skill-importer';

import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';

function createCompConfig(): CompendiumConfigSet {
  const affinityElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.affinityElems);
  const skillElems = affinityElems.concat(COMP_CONFIG_JSON.skillElems);
  const skillData = {};

  for (const demon of Object.values(DEMON_DATA_JSON)) {
    demon['price'] = Math.floor(demon['price'] / 2);
    demon['affinities'] = demon['inherits'].split('').map(char => char === 'o' ? 10 : -10);
  }

  const COST_MP = (3 << 10);

  for (const row of Object.values(SKILL_DATA_JSON)) {
    const { a: [sname, elem, target], b: nums, c: descs } = row;
    const [rank, cost, power, minHits, maxHits, acc, crit, mod] = nums;

    skillData[sname] = {
      element: elem,
      rank: Math.min(Math.floor(rank / 5) + 1, 99),
      target: target === '-' ? 'Self' : target,
      cost: cost === 0 ? 0 : cost + COST_MP,
      effect: skillRowToEffect(nums, descs, false),
    }
  }

  const compConfig: CompendiumConfig = {
    appTitle: 'Soul Hackers 2',
    races: COMP_CONFIG_JSON.races,
    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    appCssClasses: ['smt4', 'sh2'],

    lang: 'en',
    affinityElems: affinityElems,
    skillData: [skillData],
    fusionSpells: {},
    skillElems,
    elemOrder: skillElems.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    resistCodes: COMP_CONFIG_JSON.resistCodes,
    affinityBonuses: { costs: [], upgrades: [] },
    lvlModifier: 0.5,
    maxSkillSlots: 6,
    hasLightDark: false,
    hasSkillRanks: true,
    hasNonelemInheritance: false,

    demonData: [DEMON_DATA_JSON],
    evolveData: {},
    alignments: {},
    baseStats: COMP_CONFIG_JSON.baseStats,
    resistElems: COMP_CONFIG_JSON.resistElems,
    ailmentElems: [],

    demonUnlocks: DEMON_UNLOCKS_JSON,
    normalTable: FUSION_CHART_JSON,
    elementTable: ELEMENT_CHART_JSON,
    specialRecipes: SPECIAL_RECIPES_JSON,

    settingsKey: 'sh2-fusion-tool-settings',
    settingsVersion: 2401131500,
    defaultRecipeDemon: 'Pixie',
    elementRace: 'Element'
  };

  return {
    appTitle: 'Soul Hackers 2',
    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    configs: { 'sh2': compConfig }
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
