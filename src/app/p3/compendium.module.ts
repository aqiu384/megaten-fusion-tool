import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../p4/compendium-routing.module';
import { FusionDataService } from '../p4/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { P4CompendiumModule } from '../p4/p4-compendium.module';
import { CompendiumConfig, CompendiumConfigSet } from '../p4/models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import VAN_DEMON_DATA_JSON from './data/van-demon-data.json';
import FES_DEMON_DATA_JSON from './data/fes-demon-data.json';
import ANS_DEMON_DATA_JSON from './data/ans-demon-data.json';
import P3P_DEMON_DATA_JSON from './data/p3p-demon-data.json';

import VAN_ENEMY_DATA_JSON from './data/van-enemy-data.json';
import ANS_ENEMY_DATA_JSON from './data/ans-enemy-data.json';

import VAN_FUSION_CHART_JSON from './data/van-fusion-chart.json';
import FES_FUSION_CHART_JSON from './data/fes-fusion-chart.json';
import VAN_FUSION_PREREQS_JSON from './data/van-fusion-prereqs.json';
import FES_FUSION_PREREQS_JSON from './data/fes-fusion-prereqs.json';

import VAN_SKILL_DATA_JSON from './data/van-skill-data.json';
import FES_SKILL_DATA_JSON from './data/fes-skill-data.json';
import P3P_SKILL_DATA_JSON from './data/p3p-skill-data.json';

import VAN_SPECIAL_RECIPES_JSON from './data/van-special-recipes.json';
import FES_SPECIAL_RECIPES_JSON from './data/fes-special-recipes.json';
import PAIR_SPECIAL_RECIPES_JSON from './data/pair-special-recipes.json';

import INHERIT_TYPES_JSON from './data/inheritance-types.json';
import FES_PARTY_DATA_JSON from './data/fes-party-data.json';
import P3P_PARTY_DATA_JSON from './data/p3p-party-data.json';

function createCompConfig(): CompendiumConfigSet {
  const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const affinityTypes: { [elem: string]: number[] } = {};
  const races = [];
  const compConfigs: { [game: string]: CompendiumConfig } = {};

  for(const race of COMP_CONFIG_JSON['races']) {
    races.push(race);
    races.push(race + ' P');
  }

  for (let [i, ratio] of INHERIT_TYPES_JSON.ratios.entries()) {
    affinityTypes[INHERIT_TYPES_JSON.inherits[i]] = ratio.map(x => x > 1 ? x : 0);
  }

  const COST_HP = 2 << 10;
  const COST_MP = 3 << 10;
  const COST_MP_PER = 4 << 10;

  for (const skillSet of [VAN_SKILL_DATA_JSON, FES_SKILL_DATA_JSON, P3P_SKILL_DATA_JSON]) {
    for (const entry of Object.values(skillSet)) {
      if (entry['cost'] < 2000) {
        const cost = entry['cost'];
        const costType = cost > 100 ? (cost > 1000 ? COST_MP - 1000 : COST_MP_PER - 100) : COST_HP;
        entry['cost'] = cost ? cost + costType: 0;
      }
    }
  }

  for (const partyData of [FES_PARTY_DATA_JSON, P3P_PARTY_DATA_JSON]) {
    for (const [demon, entry] of Object.entries(partyData)) {
      entry.race = entry.race + ' P';
      entry['fusion'] = 'party';
    }
  }

  const ALL_DEMONS = [
    VAN_DEMON_DATA_JSON, FES_DEMON_DATA_JSON, ANS_DEMON_DATA_JSON, P3P_DEMON_DATA_JSON,
    FES_PARTY_DATA_JSON, P3P_PARTY_DATA_JSON
  ]

  for (const json of ALL_DEMONS) {
    for (const entry of Object.values(json)) {
      entry['affinities'] = affinityTypes[entry['inherits']].slice();
    }
  }

  for (const [demon, recipe] of Object.entries(PAIR_SPECIAL_RECIPES_JSON)) {
    VAN_SPECIAL_RECIPES_JSON[demon] = recipe;
  }

  for (const [demon, recipe] of Object.entries(VAN_SPECIAL_RECIPES_JSON)) {
    if (!FES_SPECIAL_RECIPES_JSON[demon]) {
      FES_SPECIAL_RECIPES_JSON[demon] = recipe;
    }
  }

  for(const [name, prereq] of Object.entries(VAN_FUSION_PREREQS_JSON)) {
    VAN_DEMON_DATA_JSON[name]['prereq'] = prereq;
  }

  for(const [name, prereq] of Object.entries(FES_FUSION_PREREQS_JSON)) {
    FES_DEMON_DATA_JSON[name]['prereq'] = prereq;
  }

  for (const game of ['p3', 'p3f', 'p3a', 'p3p']) {
    compConfigs[game] = {
      appTitle: 'Persona 3',
      appCssClasses: ['p3'],

      races,
      raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
      baseStats: COMP_CONFIG_JSON.baseStats,
      skillElems,
      resistElems: COMP_CONFIG_JSON.resistElems,
      ailmentElems: COMP_CONFIG_JSON.ailments.map(x => x.slice(0, 3)),
      affinityElems: INHERIT_TYPES_JSON.elems,
      resistCodes: COMP_CONFIG_JSON.resistCodes,
      elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),

      enemyStats: ['HP', 'MP'],
      enemyResists: COMP_CONFIG_JSON.resistElems,

      demonData: [VAN_DEMON_DATA_JSON],
      skillData: [VAN_SKILL_DATA_JSON],
      enemyData: [VAN_ENEMY_DATA_JSON],

      normalTable: FES_FUSION_CHART_JSON,
      specialRecipes: FES_SPECIAL_RECIPES_JSON,
      hasSkillCards: false,
      hasManualInheritance: false
    }
  }

  compConfigs.p3.normalTable = VAN_FUSION_CHART_JSON;
  compConfigs.p3.specialRecipes = VAN_SPECIAL_RECIPES_JSON;

  compConfigs.p3f.appTitle = 'Persona 3 FES';
  compConfigs.p3f.demonData = [VAN_DEMON_DATA_JSON, FES_DEMON_DATA_JSON, FES_PARTY_DATA_JSON];
  compConfigs.p3f.skillData = [VAN_SKILL_DATA_JSON, FES_SKILL_DATA_JSON];

  compConfigs.p3a.appTitle = 'Persona 3 FES: The Answer';
  compConfigs.p3a.demonData = [VAN_DEMON_DATA_JSON, FES_DEMON_DATA_JSON, ANS_DEMON_DATA_JSON];
  compConfigs.p3a.skillData = [VAN_SKILL_DATA_JSON, FES_SKILL_DATA_JSON];
  compConfigs.p3a.enemyData = [ANS_ENEMY_DATA_JSON];
  compConfigs.p3a.specialRecipes = PAIR_SPECIAL_RECIPES_JSON;

  compConfigs.p3p.appTitle = 'Persona 3 Portable';
  compConfigs.p3p.demonData = [VAN_DEMON_DATA_JSON, FES_DEMON_DATA_JSON, P3P_DEMON_DATA_JSON, P3P_PARTY_DATA_JSON];
  compConfigs.p3p.skillData = [VAN_SKILL_DATA_JSON, FES_SKILL_DATA_JSON, P3P_SKILL_DATA_JSON];
  compConfigs.p3p.hasSkillCards = true;

  return {
    appTitle: 'Persona 3',
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    configs: compConfigs
  };
}

const SMT_COMP_CONFIG = createCompConfig();

@NgModule({
  imports: [
    CommonModule,
    P4CompendiumModule,
    CompendiumRoutingModule
  ],
  providers: [
    Title,
    FusionDataService,
    [{ provide: FUSION_DATA_SERVICE, useExisting: FusionDataService }],
    [{ provide: FUSION_TRIO_SERVICE, useExisting: FusionDataService }],
    [{ provide: COMPENDIUM_CONFIG, useValue: SMT_COMP_CONFIG }]
  ]
})
export class CompendiumModule { }
