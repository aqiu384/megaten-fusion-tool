import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../smt4f/compendium-routing.module';
import { FusionDataService } from '../smt4f/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { Smt4CompendiumModule } from '../smt4f/smt4-compendium.module';
import { CompendiumConfig, CompendiumConfigSet } from '../smt4f/models';

import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';
import COMP_CONFIG_JSON from './data/comp-config.json';

function estimateKuzuPrice(stats: number[]): number {
  return Math.floor(Math.pow(stats.slice(stats.length - 4).reduce((acc, stat) => stat + acc, 0), 2) / 20);
}

function createCompConfig(): CompendiumConfigSet {
  const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const demonData = {};

  for (const [dname, entry] of Object.entries(DEMON_DATA_JSON)) {
    const stats = entry.stats;
    const skills = entry.skills;
    const nskills = {};

    nskills[skills[0]] = 0;
    nskills[skills[1]] = entry.lvl + 1;
    nskills[skills[skills.length - 2]] = 4488;
    nskills[skills[skills.length - 1]] = 0;

    if (skills.length > 4) {
      nskills[skills[2]] = entry.lvl + 2;
    } if (entry['skilli']) {
      nskills[entry['skilli']] = 0;
    }

    entry.stats = [stats[0], stats[5]].concat(stats.slice(1, 5));
    entry['price'] = 50 * (estimateKuzuPrice(entry.stats) + entry.lvl);
    entry['affinities'] = [];
    demonData[dname] = Object.assign({}, entry);
    demonData[dname].skills = nskills;
  }

  const COST_MG = 9 << 10;

  for (const entry of Object.values(SKILL_DATA_JSON)) {
    entry['element'] = entry.elem.slice(0, 3);

    if (entry['power']) {
      entry['effect'] = entry['power'] + ' dmg ' + (entry['effect'] || '');
    }

    entry['cost'] = entry['cost'] ? entry['cost'] + COST_MG - 2000 : 0;
    entry['rank'] = entry['unique'] ? 99 : entry['element'] === 'pas' ? 1 : (entry['cost'] & 0x3FF) / 10 || 0;
  }

  for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
    demonData[name].prereq = prereq;
    demonData[name].fusion = 'accident';
  }

  const compConfig: CompendiumConfig = {
    appTitle: 'Raidou Kuzunoha vs. King Abaddon',
    races: COMP_CONFIG_JSON.races,
    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    appCssClasses: ['smt4', 'krao'],

    lang: 'en',
    translations: { en: ['ja'] },
    affinityElems: [],
    skillData: [SKILL_DATA_JSON],
    fusionSpells: {},
    skillElems,
    elemOrder: skillElems.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    resistCodes: COMP_CONFIG_JSON.resistCodes,
    affinityBonuses: { costs: [], upgrades: [] },
    lvlModifier: 2.5,
    maxSkillSlots: 7,
    hasLightDark: false,

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

    settingsKey: 'krao-fusion-tool-settings',
    settingsVersion: 2401131500,
    defaultRecipeDemon: 'Pixie',
    elementRace: 'Element'
  };

  return {
    appTitle: 'Raidou Kuzunoha vs. King Abaddon',
    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    configs: { 'krao': compConfig }
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
