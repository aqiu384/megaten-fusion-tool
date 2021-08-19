import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../smt4f/compendium-routing.module';
import { FusionDataService } from '../smt4f/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { Smt4CompendiumModule } from '../smt4f/smt4-compendium.module';
import { CompendiumConfig } from '../smt4f/models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import FUSION_CHART_JSON from '../smt4/data/fusion-chart.json';
import ELEMENT_CHART_JSON from '../smt4/data/element-chart.json';

declare const SMT5_DEMON_DATA: any;
declare const SMT5_SKILL_DATA: any;
declare const SMT5_AFFINITY_BONUSES: any;
declare const SMT5_SPECIAL_RECIPES: any;

function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

const affinityElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.affinityElems);
const skillElems = affinityElems.concat(COMP_CONFIG_JSON.skillElems);
const affinityBonuses: { costs: number[][], upgrades: number[][] } = { costs: [], upgrades: [] };

for (const elem of affinityElems) {
  const bonusElem = SMT5_AFFINITY_BONUSES['elements'][elem];
  affinityBonuses.costs.push(SMT5_AFFINITY_BONUSES['costs'][bonusElem]);
  affinityBonuses.upgrades.push(SMT5_AFFINITY_BONUSES['upgrades'][bonusElem]);
}

for (const demon of Object.values(SMT5_DEMON_DATA)) {
  demon['price'] = demon['lvl'] * demon['lvl'];
}

for (const skill of Object.values(SMT5_SKILL_DATA)) {
  if (skill['rank']) { continue; }
  if (skill['cost']) { skill['rank'] = Math.ceil((skill['cost'] - 1000) / 5); }
  else { skill['rank'] = 1; }
}

export const SMT5_COMPENDIUM_CONFIG: CompendiumConfig = {
  appTitle: 'Shin Megami Tensei V',
  races: COMP_CONFIG_JSON.races,
  raceOrder: getEnumOrder(COMP_CONFIG_JSON.races),
  appCssClasses: ['smt4', 'smt5'],

  affinityElems,
  skillData: SMT5_SKILL_DATA,
  skillElems,
  elemOrder: getEnumOrder(skillElems),
  resistCodes: COMP_CONFIG_JSON.resistCodes,
  affinityBonuses,

  demonData: SMT5_DEMON_DATA,
  evolveData: {},
  dlcDemons: COMP_CONFIG_JSON.dlcDemons,
  baseStats: COMP_CONFIG_JSON.baseStats,
  resistElems: COMP_CONFIG_JSON.resistElems,
  ailmentElems: COMP_CONFIG_JSON.ailments,

  normalTable: FUSION_CHART_JSON,
  elementTable: ELEMENT_CHART_JSON,
  specialRecipes: SMT5_SPECIAL_RECIPES,

  settingsKey: 'smt5-fusion-tool-settings',
  settingsVersion: 1709211400
}

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
    [{ provide: COMPENDIUM_CONFIG, useValue: SMT5_COMPENDIUM_CONFIG }]
  ]
})
export class CompendiumModule { }
