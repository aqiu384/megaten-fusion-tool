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
import ORPHEUS_TELOS_JSON from './data/orpheus-telos.json';
import PSYCHE_JSON from './data/psyche.json';

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

function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
const inheritTypes: { [elem: string]: number[] } = {};
const races = [];
const compConfigs: { [game: string]: CompendiumConfig } = {};

for(const race of COMP_CONFIG_JSON['races']) {
  races.push(race);
  races.push(race + ' P');
}

for (let i = 0; i < INHERIT_TYPES_JSON.inherits.length; i++) {
  inheritTypes[INHERIT_TYPES_JSON.inherits[i]] = INHERIT_TYPES_JSON.ratios[i];
}

for (const partyData of [FES_PARTY_DATA_JSON, P3P_PARTY_DATA_JSON]) {
  for (const [demon, entry] of Object.entries(partyData)) {
    entry.race = entry.race + ' P';
    entry['fusion'] = 'party';
  }
}

for (const [demon, entry] of Object.entries(PSYCHE_JSON)) {
  entry.race = entry.race + ' P';
  entry['fusion'] = 'party';
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

for (const game of ['p3', 'p3fes', 'p3aeg', 'p3p']) {
  compConfigs[game] = {
    appTitle: 'Persona 3',
    appCssClasses: ['p3'],

    races,
    raceOrder: getEnumOrder(races),
    baseStats: COMP_CONFIG_JSON.baseStats,
    skillElems,
    resistElems: COMP_CONFIG_JSON.resistElems,
    resistCodes: COMP_CONFIG_JSON.resistCodes,
    elemOrder: getEnumOrder(skillElems),
    inheritTypes,
    inheritElems: INHERIT_TYPES_JSON.elems,

    enemyStats: ['HP', 'MP'],
    enemyResists: COMP_CONFIG_JSON.resistElems.concat(['alm']),

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

compConfigs.p3fes.appTitle = 'Persona 3 FES';
compConfigs.p3fes.demonData = [FES_PARTY_DATA_JSON, VAN_DEMON_DATA_JSON, FES_DEMON_DATA_JSON, ORPHEUS_TELOS_JSON];
compConfigs.p3fes.skillData = [VAN_SKILL_DATA_JSON, FES_SKILL_DATA_JSON];

compConfigs.p3aeg.appTitle = 'Persona 3 FES: The Answer';
compConfigs.p3aeg.demonData = [VAN_DEMON_DATA_JSON, FES_DEMON_DATA_JSON, ANS_DEMON_DATA_JSON, PSYCHE_JSON];
compConfigs.p3aeg.skillData = [VAN_SKILL_DATA_JSON, FES_SKILL_DATA_JSON];
compConfigs.p3aeg.enemyData = [ANS_ENEMY_DATA_JSON];
compConfigs.p3aeg.specialRecipes = PAIR_SPECIAL_RECIPES_JSON;

compConfigs.p3p.appTitle = 'Persona 3 Portable';
compConfigs.p3p.demonData = [P3P_PARTY_DATA_JSON, VAN_DEMON_DATA_JSON, FES_DEMON_DATA_JSON, ORPHEUS_TELOS_JSON, P3P_DEMON_DATA_JSON];
compConfigs.p3p.skillData = [VAN_SKILL_DATA_JSON, FES_SKILL_DATA_JSON, P3P_SKILL_DATA_JSON];
compConfigs.p3p.hasSkillCards = true;

export const P3_COMPENDIUM_CONFIG: CompendiumConfigSet = {
  appTitle: 'Persona 3',
  raceOrder: getEnumOrder(races),
  configs: compConfigs
};

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
    [{ provide: COMPENDIUM_CONFIG, useValue: P3_COMPENDIUM_CONFIG }]
  ]
})
export class CompendiumModule { }
