import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../smt4f/compendium-routing.module';
import { FusionDataService } from '../smt4f/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { Smt4CompendiumModule } from '../smt4f/smt4-compendium.module';
import { CompendiumConfig, CompendiumConfigSet } from '../smt4f/models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import MAGATAMA_DATA_JSON from './data/magatama-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import EVOLUTIONS_JSON from './data/evolutions.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';

function estimateBasePrice(stats: number[]): number {
  return 100 * Math.floor(Math.pow(stats.slice(2).reduce((acc, stat) => stat + acc, 0), 2) / 20);
}

function createCompConfig(): CompendiumConfigSet {
  const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);

  for (const entry of Object.values(DEMON_DATA_JSON)) {
    entry['price'] = estimateBasePrice(entry.stats) / 2;
  }

  for (const entry of Object.values(MAGATAMA_DATA_JSON)) {
    entry['fusion'] = 'accident';
    entry['stats'] = [0, 0].concat(entry['stats']);
    entry['race'] = 'Magatama';
  }

  const COST_HP = 2 << 10;
  const COST_MP = (3 << 10) - 1000;

  for (const row of Object.values(SKILL_DATA_JSON)) {
    const cost = row['cost'];
    if (cost) { row['cost'] = cost + (cost < 1000 ? COST_HP : COST_MP); }
  }

  for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
    DEMON_DATA_JSON[name].prereq = prereq;
    DEMON_DATA_JSON[name].fusion = 'accident';
  }

  const compConfig: CompendiumConfig = {
    appTitle: 'Shin Megami Tensei III: Nocturne',
    races: COMP_CONFIG_JSON.races,
    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    appCssClasses: ['smt4', 'smt3'],

    lang: 'en',
    affinityElems: [],
    skillData: [SKILL_DATA_JSON],
    fusionSpells: {},
    skillElems,
    elemOrder: skillElems.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    resistCodes: COMP_CONFIG_JSON.resistCodes,
    affinityBonuses: { costs: [], upgrades: [] },
    lvlModifier: 1,
    maxSkillSlots: 8,
    hasLightDark: false,
    hasSkillRanks: true,
    hasNonelemInheritance: true,

    demonData: [DEMON_DATA_JSON, MAGATAMA_DATA_JSON],
    evolveData: EVOLUTIONS_JSON,
    alignments: {},
    baseStats: COMP_CONFIG_JSON.baseStats,
    resistElems: COMP_CONFIG_JSON.resistElems,
    ailmentElems: COMP_CONFIG_JSON.ailments,

    demonUnlocks: DEMON_UNLOCKS_JSON,
    normalTable: FUSION_CHART_JSON,
    elementTable: ELEMENT_CHART_JSON,
    specialRecipes: SPECIAL_RECIPES_JSON,

    settingsKey: 'smt3-fusion-tool-settings',
    settingsVersion: 2401131500,
    defaultRecipeDemon: 'Pixie',
    elementRace: 'Element'
  };

  return {
    appTitle: 'Shin Megami Tensei III: Nocturne',
    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    configs: { 'smt4': compConfig }
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
