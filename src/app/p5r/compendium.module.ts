import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../p5/compendium-routing.module';
import { FusionDataService } from '../p5/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { P5CompendiumModule } from '../p5/p5-compendium.module';
import { CompendiumConfig } from '../p5/models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import INHERIT_TYPES_JSON from '../p5/data/inheritance-types.json';

import DEMON_DATA_JSON from './data/demon-data.json';
import VAN_SKILL_DATA_JSON from '../p5/data/skill-data.json';
import ROY_SKILL_DATA_JSON from './data/skill-data.json';
import ENEMY_DATA_JSON from './data/enemy-data.json';
import PARTY_DATA_JSON from './data/party-data.json';
import DLC_DATA_JSON from './data/dlc-data.json';

import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import { importSkillRow } from '../pq2/models/skill-importer';

function createCompConfig(): CompendiumConfig {
  const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const costTypes = [2 << 10, (5 << 10) - 1000, (15 << 10) - 2000];
  const affinityTypes: { [elem: string]: number[] } = {};
  const skillData = {};
  const races = [];

  for(const race of COMP_CONFIG_JSON.races) {
    races.push(race);
    races.push(race + ' P');
  }

  for (let [i, ratio] of INHERIT_TYPES_JSON.ratios.entries()) {
    affinityTypes[INHERIT_TYPES_JSON.inherits[i]] = ratio.split('').map(x => x === 'o' ? 10 : -10);
  }

  for (const json of [DEMON_DATA_JSON, DLC_DATA_JSON, PARTY_DATA_JSON]) {
    for (const entry of Object.values(json)) {
      entry['skills'][entry['trait']] = 0;
      entry['affinities'] = affinityTypes[entry['inherits']].slice();
    }
  }

  for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
    DEMON_DATA_JSON[name].prereq = prereq;
  }

  for (const entry of Object.values(ENEMY_DATA_JSON)) {
    entry['yen'] = entry['price'];
    entry['area'] = [entry['areas']];
  }

  const COST_HP = 2 << 10;
  const COST_MP = 3 << 10;

  for (const skillJson of [VAN_SKILL_DATA_JSON, ROY_SKILL_DATA_JSON]) {
    for (const row of Object.values(skillJson)) {
      skillData[row.a[0]] = importSkillRow(row, costTypes);
    }
  }

  return {
    appTitle: 'Persona 5 Royal',

    races,
    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    baseStats: COMP_CONFIG_JSON.baseStats,
    skillElems,
    resistElems: COMP_CONFIG_JSON.resistElems,
    affinityElems: INHERIT_TYPES_JSON.elems,
    resistCodes: COMP_CONFIG_JSON.resistCodes,
    elemOrder: skillElems.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),

    enemyStats: ['HP', 'MP'],
    enemyResists: COMP_CONFIG_JSON.resistElems,

    demonData: [DEMON_DATA_JSON, DLC_DATA_JSON, PARTY_DATA_JSON],
    skillData: [skillData],
    enemyData: [ENEMY_DATA_JSON],

    normalTable: FUSION_CHART_JSON,
    elementTable: ELEMENT_CHART_JSON,
    specialRecipes: SPECIAL_RECIPES_JSON,
    demonUnlocks: DEMON_UNLOCKS_JSON,

    settingsKey: 'p5r-fusion-tool-settings',
    settingsVersion: 2401131500
  };
}

const SMT_COMP_CONFIG = createCompConfig();

@NgModule({
  imports: [
    CommonModule,
    P5CompendiumModule,
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
