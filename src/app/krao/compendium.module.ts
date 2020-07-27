import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumConfig } from '../krch/models';
import {
  COMPENDIUM_CONFIG,
  FUSION_DATA_SERVICE,
  SMT_NORMAL_FISSION_CALCULATOR,
  SMT_NORMAL_FUSION_CALCULATOR
} from '../compendium/constants';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';

import { FusionDataService } from '../krch/fusion-data.service';
import { SmtKuzuCompendiumModule } from '../krch/smt-kuzu-compendium.module';
import { CompendiumRoutingModule } from '../krch/compendium-routing.module';

function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

const races = COMP_CONFIG_JSON.races;
const resistElems = COMP_CONFIG_JSON.resistElems.map(e => e.slice(0, 3));
const skillElems = resistElems.concat(COMP_CONFIG_JSON.skillElems.map(e => e.slice(0, 3)));
const MITAMA_TABLE = [
  ['Nigi', 'Undi', 'Nigi', 'Ara ', 'Kusi'],
  ['Ara ', 'Sylp', 'Kusi', 'Nigi'],
  ['Ara ', 'Nigi', 'Kusi'],
  ['Kusi', 'Ara '],
  ['Saki'],
  []
];

for (const entry of Object.values(DEMON_DATA_JSON)) {
  const stats = entry.stats;
  const skills = entry.skills;
  const nskills = {};

  nskills[skills[0]] = 0;
  nskills[skills[1]] = entry.lvl + 1;
  nskills[skills[skills.length - 2]] = 4488;
  nskills[skills[skills.length - 1]] = 0;

  if (skills.length > 4) {
    nskills[skills[2]] = entry.lvl + 2;
  } if (entry.skilli) {
    nskills[entry.skilli] = 0;
  }

  entry.stats = [stats[0], stats[5]].concat(stats.slice(1, 5));
  entry['nskills'] = nskills;
}

for (const entry of Object.values(SKILL_DATA_JSON)) {
  if (entry.power) {
    entry.effect = entry.power + ' dmg ' + (entry.effect || '');
  }

  entry['rank'] = entry.unique ? 99 : (entry.cost - 2000) / 10 || 0;
}

for(const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
  DEMON_DATA_JSON[name]['prereq'] = prereq;
}

export const SMT_COMP_CONFIG: CompendiumConfig = {
  appTitle: 'Raidou Kuzunoha vs. King Abaddon',
  gameTitles: { krao: 'Raidou Kuzunoha vs. King Abaddon' },

  appCssClasses: ['kuzu', 'krao'],
  races,
  resistElems,
  skillElems,
  baseStats: COMP_CONFIG_JSON.baseStats,
  fusionLvlMod: 2.5,
  resistCodes: COMP_CONFIG_JSON.resistCodes,

  raceOrder: getEnumOrder(races),
  elemOrder: getEnumOrder(skillElems),
  fissionCalculator: SMT_NORMAL_FISSION_CALCULATOR,
  fusionCalculator: SMT_NORMAL_FUSION_CALCULATOR,

  demonData: { krao: [DEMON_DATA_JSON] },
  skillData: { krao: [SKILL_DATA_JSON] },
  normalTable: FUSION_CHART_JSON,
  elementTable: ELEMENT_CHART_JSON,
  mitamaTable: MITAMA_TABLE,
  specialRecipes: { krao: SPECIAL_RECIPES_JSON }
};

@NgModule({
  imports: [
    CommonModule,
    SmtKuzuCompendiumModule,
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
