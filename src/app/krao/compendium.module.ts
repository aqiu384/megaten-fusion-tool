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

function resistNumToStr(value: number): string {
  if (value < -1000) { return 'd'; }
  if (value < 0) { return 'r'; }
  if (value === 0) { return 'n'; }
  if (value < 100) { return 's'; }
  if (value < 1000) { return '-'; }
  if (value < 2000) { return 'w'; }
  return 'f';
}

const demonData = {};
const skillData = {};
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

for (const [demon, entry] of Object.entries(DEMON_DATA_JSON)) {
  entry['nresists'] = entry.resists.map(resistNumToStr).join('')

  if (entry.person !== 'N/A') {
    entry['race'] = entry.order;
    demonData[demon] = entry;
  }
}

for (const [skill, entry] of Object.entries(SKILL_DATA_JSON)) {
  if (entry.elem !== 'investigate' && entry.elem !== 'boss') {
    entry.elem = entry.elem.slice(0, 3);
    skillData[skill] = entry;
  }
}

for (const [name, recipe] of Object.entries(SPECIAL_RECIPES_JSON)) {
  const entry = demonData[name];
  const prereq = recipe.prereq;

  if (entry.race === 'Fiend') {
    recipe.prereq = `
      (Fiend Fever Fusion) Fuse any two demons at new moon,
      with fusion count divisble by 7, and at least ${prereq} gem points.
    `;
  } else if (prereq && prereq !== 'accident') {
    recipe.prereq = `
      (Evil Fever Fusion) Fuse any two demons
      with fusion count divisble by 7 and at least ${prereq} gem points.
    `;
  }
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

  demonData: { krao: [demonData] },
  skillData: { krao: [skillData] },
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
