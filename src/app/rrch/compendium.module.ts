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
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';
import CONFINE_DROPS_JSON from './data/confine-drops.json';
import COMP_CONFIG_JSON from './data/comp-config.json';

function estimateCompCost(entry: any): number {
  const statPrice = Math.floor(entry.stats.slice(entry.stats.length - 4).reduce((acc, stat) => stat + acc, 0) ** 2 / 20);
  return 10 * (statPrice + entry.lvl) + (entry.race === 'Element' ? 2000 : entry.race === 'Mitama' ? 8000 : 0) / 20;
}

function createCompConfig(): CompendiumConfigSet {
  const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const demonData = {};
  const skillData = {};

  for (const [dname, entry] of Object.entries(DEMON_DATA_JSON)) {
    const lvl = Math.floor(entry.lvl);
    const stats = entry.stats;
    const nskills = entry.skills.reduce((acc, x, i) => { acc[x] = i + lvl; return acc; }, {});
    nskills[entry.skills[0]] = 0;
    nskills[entry.skills[entry.skills.length - 1]] = 4488;

    if (COMP_CONFIG_JSON.raceSkills[entry.race]) {
      nskills[COMP_CONFIG_JSON.raceSkills[entry.race]] = 0.1;
    } if (entry['skilli']) {
      nskills[entry['skilli']] = 0.2;
    }

    entry['price'] = estimateCompCost(entry) / 2;
    entry['affinities'] = [];
    entry['skillCards'] = [];
    demonData[dname] = Object.assign({}, entry);
    demonData[dname].skills = nskills;
  }

  for (const [dname, entry] of Object.entries(CONFINE_DROPS_JSON)) {
    const cards = entry.items.filter(s => s.startsWith('Book of ')).map(x => x.slice(8));
    demonData[dname].skillCards = cards.reduce((acc, s) => { acc[s] = 3570; return acc; }, {});
  }

  const COST_MAG = 9 << 10;

  for (const row of Object.values(SKILL_DATA_JSON)) {
    const { a: [sname, elem, target], b: nums, c: descs } = row;
    const [rank, cost, power, minHits, maxHits, acc, crit, mod] = nums;

    skillData[sname] = {
      element: elem,
      rank: rank || 1,
      target: target === '-' ? 'Self' : target,
      cost: cost === 0 ? 0 : cost + COST_MAG,
      effect: skillRowToEffect(nums, descs, false),
    }

    if (descs[2] !== '-') { skillData[sname].card = descs[2]; }
  }

  for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
    demonData[name].prereq = prereq;
    demonData[name].fusion = 'accident';
  }

  const compConfig: CompendiumConfig = {
    appTitle: 'Raidou Remastered: The Mystery of the Soulless Army',
    races: COMP_CONFIG_JSON.races,
    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    appCssClasses: ['smt4', 'krch', 'rrch'],

    lang: 'en',
    affinityElems: [],
    skillData: [skillData],
    fusionSpells: {},
    skillElems,
    elemOrder: skillElems.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    resistCodes: COMP_CONFIG_JSON.resistCodes,
    affinityBonuses: { costs: [], upgrades: [] },
    lvlModifier: 2.5,
    maxSkillSlots: 8,
    hasLightDark: false,
    hasSkillRanks: false,
    hasNonelemInheritance: false,

    demonData: [demonData],
    evolveData: {},
    alignments: {},
    baseStats: COMP_CONFIG_JSON.baseStats,
    resistElems: COMP_CONFIG_JSON.resistElems,
    ailmentElems: [],

    demonUnlocks: DEMON_UNLOCKS_JSON,
    normalTable: FUSION_CHART_JSON,
    elementTable: ELEMENT_CHART_JSON,
    specialRecipes: SPECIAL_RECIPES_JSON,

    settingsKey: 'rrch-fusion-tool-settings',
    settingsVersion: 2506201800,
    defaultRecipeDemon: 'Pixie',
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
