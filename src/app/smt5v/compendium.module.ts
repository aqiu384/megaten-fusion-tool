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
import DEMON_DATA_JSON from '../smt5/data/demon-data.json';
import VEN_DEMON_DATA_JSON from './data/demon-data.json';
import INNATE_SKILLS_JSON from './data/innate-skills.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import TALISMAN_SKILLS_JSON from '../smt5/data/talisman-skills.json';
import PERIAPT_SKILLS_JSON from './data/periapt-skills.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from '../smt5/data/element-chart.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import AFFINITIES_JSON from '../smt5/data/affinity-bonuses.json';
import JA_NAMES_JSON from '../smt5/data/ja-names.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';

function createCompConfig(): CompendiumConfig {
  const affinityElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.affinityElems);
  const skillElems = affinityElems.concat(COMP_CONFIG_JSON.skillElems);
  const affinityBonuses: { costs: number[][], upgrades: number[][] } = { costs: [], upgrades: [] };
  const skillData = {};

  for (const elem of affinityElems) {
    const bonusElem = AFFINITIES_JSON['elements'][elem];
    affinityBonuses.costs.push(AFFINITIES_JSON['costs'][bonusElem]);
    affinityBonuses.upgrades.push(AFFINITIES_JSON['upgrades'][bonusElem]);
  }

  const COST_MP = 3 << 10;
  const COST_MAG = 19 << 10;

  for (const row of Object.values(SKILL_DATA_JSON)) {
    const { a: [sname, elem, target], b: nums, c: descs } = row;
    const [rank, cost, power, minHits, maxHits, acc, crit, mod] = nums;
    nums[5] = acc < 200 ? acc : 100;

    skillData[sname] = {
      element: elem,
      rank: Math.min(rank, 99),
      target: target === '-' ? 'Self' : target,
      cost: cost === 0 ? 0 : cost < 1000 ? COST_MP + cost : COST_MAG,
      effect: skillRowToEffect(nums, descs, false),
    }
  }

  for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
    VEN_DEMON_DATA_JSON[name].prereq = prereq;
    VEN_DEMON_DATA_JSON[name].fusion = 'accident';
  }

  for (const demonJson of [DEMON_DATA_JSON, VEN_DEMON_DATA_JSON]) {
    for (const [dname, entry] of Object.entries(demonJson)) {
      entry.innate = INNATE_SKILLS_JSON[dname] || '-';
    }
  }

  return {
    appTitle: 'Shin Megami Tensei V Vengeance',
    races: COMP_CONFIG_JSON.races,
    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    appCssClasses: ['smt4', 'smt5', 'smt5v'],

    lang: 'en',
    jaNames: JA_NAMES_JSON,
    affinityElems,
    skillData: [skillData],
    fusionSpells: Object.assign(PERIAPT_SKILLS_JSON, TALISMAN_SKILLS_JSON),
    skillElems,
    elemOrder: skillElems.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    resistCodes: COMP_CONFIG_JSON.resistCodes,
    affinityBonuses,
    lvlModifier: 1,

    demonData: [DEMON_DATA_JSON, VEN_DEMON_DATA_JSON],
    evolveData: {},
    baseStats: COMP_CONFIG_JSON.baseStats,
    resistElems: COMP_CONFIG_JSON.resistElems,
    ailmentElems: COMP_CONFIG_JSON.ailments,

    demonUnlocks: DEMON_UNLOCKS_JSON,
    normalTable: FUSION_CHART_JSON,
    elementTable: ELEMENT_CHART_JSON,
    specialRecipes: SPECIAL_RECIPES_JSON,

    settingsKey: 'smt5v-fusion-tool-settings',
    settingsVersion: 2406242350,
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
