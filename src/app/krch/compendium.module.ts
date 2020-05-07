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
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
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

const races = COMP_CONFIG_JSON.races;
const resistElems = COMP_CONFIG_JSON.resistElems.map(e => e.slice(0, 3));
const skillElems = resistElems.concat(COMP_CONFIG_JSON.skillElems.map(e => e.slice(0, 3)));

for (const entry of Object.values(DEMON_DATA_JSON)) {
  const lvl = Math.floor(entry.lvl);
  const skills = entry.skills;
  const nskills = {};

  nskills[skills[0]] = 0;
  nskills[COMP_CONFIG_JSON.raceSkills[entry.race]] = 0;
  nskills[skills[skills.length - 2]] = lvl + 2;
  nskills[skills[skills.length - 1]] = lvl + 1;

  if (skills.length > 3) {
    nskills[skills[1]] = 0;
  } if (entry.skilli) {
    nskills[entry.skilli] = 0;
  }

  entry['nskills'] = nskills;
}

for (const entry of Object.values(SKILL_DATA_JSON)) {
  entry.elem = entry.elem.slice(0, 3);
}

for(const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
  DEMON_DATA_JSON[name]['prereq'] = prereq;
}

export const SMT_COMP_CONFIG: CompendiumConfig = {
  appTitle: 'Raidou Kuzunoha vs. The Soulless Army',
  gameTitles: { krch: 'Raidou Kuzunoha vs. The Soulless Army' },
  appCssClasses: ['kuzu', 'krch'],

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

  demonData: { krch: [DEMON_DATA_JSON] },
  skillData: { krch: [SKILL_DATA_JSON] },
  normalTable: FUSION_CHART_JSON,
  elementTable: { elems: [], races: [], table: [] },
  mitamaTable: [],
  specialRecipes: { krch: SPECIAL_RECIPES_JSON }
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
