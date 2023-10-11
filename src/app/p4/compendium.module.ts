import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from './compendium-routing.module';
import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { P4CompendiumModule } from './p4-compendium.module';
import { CompendiumConfig, CompendiumConfigSet } from './models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import GOLDEN_DEMON_DATA_JSON from './data/golden-demon-data.json';
import ENEMY_DATA_JSON from './data/enemy-data.json';
import GOLDEN_ENEMY_DATA_JSON from './data/golden-enemy-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import GOLDEN_FUSION_CHART_JSON from './data/golden-fusion-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import INHERIT_TYPES_JSON from './data/inheritance-types.json';
import PARTY_DATA_JSON from './data/party-data.json';
import GOLDEN_PARTY_DATA_JSON from './data/golden-party-data.json';

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
const skillData = {};
const compConfigs: { [game: string]: CompendiumConfig } = {};

for(const race of COMP_CONFIG_JSON['races']) {
  races.push(race);
  races.push(race + ' P');
}

for (let i = 0; i < INHERIT_TYPES_JSON.inherits.length; i++) {
  inheritTypes[INHERIT_TYPES_JSON.inherits[i]] = INHERIT_TYPES_JSON.ratios[i];
}

for (const entry of Object.values(PARTY_DATA_JSON)) {
  entry.race = entry.race + ' P';
  entry['fusion'] = 'party';
}

for (const entry of Object.values(GOLDEN_PARTY_DATA_JSON)) {
  entry.race = entry.race + ' P';
  entry['fusion'] = 'party';
}

for (const skill of SKILL_DATA_JSON) {
  skillData[skill.name] = {
    element: skill.elem,
    cost: skill.cost || 0,
    effect: skill.power ? skill.power + ' power' + (skill.effect ? ', ' + skill.effect : '') : skill.effect,
    target: skill.target || 'Self',
    rank: skill.rank + (skill.mutate ? 0.5 : 0),
  }

  if (skill.hasOwnProperty('card')) {
    skillData[skill.name].card = skill.card;
  } else if (skill.hasOwnProperty('shuffle')) {
    skillData[skill.name].card = 'Shuffle ' + skill.shuffle;
  }
}

for (const game of ['p4', 'p4g']) {
  compConfigs[game] = {
    appTitle: 'Persona 4',
    appCssClasses: ['p4'],

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
    enemyResists: COMP_CONFIG_JSON.resistElems.concat(['almighty']),

    demonData: [DEMON_DATA_JSON, PARTY_DATA_JSON],
    skillData: [skillData],
    enemyData: [ENEMY_DATA_JSON],

    normalTable: FUSION_CHART_JSON,
    specialRecipes: SPECIAL_RECIPES_JSON,
    hasSkillCards: false,
    hasManualInheritance: false
  }
}

compConfigs.p4g.appTitle = 'Persona 4 Golden';
compConfigs.p4g.demonData = [DEMON_DATA_JSON, GOLDEN_DEMON_DATA_JSON, GOLDEN_PARTY_DATA_JSON];
compConfigs.p4g.enemyData = [ENEMY_DATA_JSON, GOLDEN_ENEMY_DATA_JSON];
compConfigs.p4g.normalTable = GOLDEN_FUSION_CHART_JSON;
compConfigs.p4g.hasSkillCards = true;
compConfigs.p4g.hasManualInheritance = true;

export const P4_COMPENDIUM_CONFIG: CompendiumConfigSet = {
  appTitle: 'Persona 4',
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
    [{ provide: COMPENDIUM_CONFIG, useValue: P4_COMPENDIUM_CONFIG }]
  ]
})
export class CompendiumModule { }
