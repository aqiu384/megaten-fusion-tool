import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumConfig } from './models';
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
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';

import { FusionDataService } from './fusion-data.service';
import { SmtKuzuCompendiumModule } from './smt-kuzu-compendium.module';
import { CompendiumRoutingModule } from './compendium-routing.module';

function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

const demonData = {};
const skillData = {};
const races = COMP_CONFIG_JSON.races;
const resistElems = COMP_CONFIG_JSON.resistElems.map(e => e.slice(0, 3));
const skillElems = resistElems.concat(COMP_CONFIG_JSON.skillElems.map(e => e.slice(0, 3)));

for (const [demon, entry] of Object.entries(DEMON_DATA_JSON)) {
  if (entry.order) {
    entry['race'] = entry.order;
    demonData[demon] = entry;
  }
}

for (const [skill, entry] of Object.entries(SKILL_DATA_JSON)) {
  if (entry.elem !== 'investigate') {
    entry.elem = entry.elem.slice(0, 3);
    skillData[skill] = entry;
  }
}

export const SMT_COMP_CONFIG: CompendiumConfig = {
  appTitle: 'Raidou Kuzunoha vs. The Soulless Army',
  appCssClasses: ['kuzu', 'krch'],
  races,
  resistElems,
  skillElems,
  baseStats: COMP_CONFIG_JSON.baseStats,
  fusionLvlMod: 2.5,

  raceOrder: getEnumOrder(races),
  elemOrder: getEnumOrder(skillElems),
  fissionCalculator: SMT_NORMAL_FISSION_CALCULATOR,
  fusionCalculator: SMT_NORMAL_FUSION_CALCULATOR,

  demonData,
  skillData,
  normalTable: FUSION_CHART_JSON,
  elementTable: { elems: [], races: [], table: [] },
  mitamaTable: [],
  specialRecipes: SPECIAL_RECIPES_JSON
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
