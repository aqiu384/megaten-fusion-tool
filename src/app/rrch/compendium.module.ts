import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../smt4f/compendium-routing.module';
import { FusionDataService } from '../smt4f/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { Smt4CompendiumModule } from '../smt4f/smt4-compendium.module';
import { CompendiumConfig, CompendiumConfigSet } from '../smt4f/models';

import DEMON_DATA_JSON from './data/demon-data.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import COMP_CONFIG_JSON from './data/comp-config.json';

function estimateKuzuPrice(stats: number[]): number {
  return Math.floor(Math.pow(stats.slice(stats.length - 4).reduce((acc, stat) => stat + acc, 0), 2) / 20);
}

function createCompConfig(): CompendiumConfigSet {
  const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const demonData = {};

  for (const [dname, entry] of Object.entries(DEMON_DATA_JSON)) {
    const stats = entry.stats;
    const nskills = {};

    entry.stats = [stats[0], stats[5]].concat(stats.slice(1, 5));
    entry['price'] = 50 * (estimateKuzuPrice(entry.stats) + entry.lvl);
    entry['affinities'] = [];
    demonData[dname] = Object.assign({}, entry);
    demonData[dname].skills = nskills;
  }

  const compConfig: CompendiumConfig = {
    appTitle: 'Raidou Remastered: The Mystery of the Soulless Army',
    races: COMP_CONFIG_JSON.races,
    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    appCssClasses: ['smt4', 'krch', 'rrch'],

    lang: 'en',
    affinityElems: [],
    skillData: [],
    fusionSpells: {},
    skillElems,
    elemOrder: skillElems.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    resistCodes: COMP_CONFIG_JSON.resistCodes,
    affinityBonuses: { costs: [], upgrades: [] },
    lvlModifier: 2.5,
    maxSkillSlots: 8,
    hasLightDark: false,
    hasSkillRanks: false,
    hasNonelemInheritance: true,

    demonData: [demonData],
    evolveData: {},
    alignments: {},
    baseStats: COMP_CONFIG_JSON.baseStats,
    resistElems: COMP_CONFIG_JSON.resistElems,
    ailmentElems: [],

    demonUnlocks: [],
    normalTable: FUSION_CHART_JSON,
    elementTable: ELEMENT_CHART_JSON,
    specialRecipes: {},

    settingsKey: 'rrch-fusion-tool-settings',
    settingsVersion: 2401131500,
    defaultRecipeDemon: 'Undine',
    elementRace: 'Element'
  };

  return {
    appTitle: 'Raidou Remastered: The Mystery of the Soulless Army',
    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    configs: { 'rrch': compConfig }
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
