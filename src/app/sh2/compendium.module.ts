import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../smt4f/compendium-routing.module';
import { FusionDataService } from '../smt4f/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { Smt4CompendiumModule } from '../smt4f/smt4-compendium.module';
import { CompendiumConfig } from '../smt4f/models';

declare const SH2_DEMON_DATA: any;
declare const SH2_SKILL_DATA: any;
declare const SH2_SPECIAL_RECIPES: any;
declare const SH2_FUSION_PREREQS: any;
declare const SH2_FUSION_CHART: any;
declare const SH2_ELEMENT_CHART: any;

import COMP_CONFIG_JSON from './data/comp-config.json';
import JAP_NAMES_JSON from '../smt4/data/jap-names.json';

function getEnumOrder(target: string[]): { [key: string]: number } {
  return target.reduce((acc, t, i) => { acc[t] = i; return acc }, {});
}

const affinityElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.affinityElems);
const skillElems = affinityElems.concat(COMP_CONFIG_JSON.skillElems);
const engNames: { [ename: string]: string } = {};

for (const [jname, ename] of Object.entries(JAP_NAMES_JSON)) {
  engNames[ename] = jname;
}

for (const demon of Object.values(SH2_DEMON_DATA)) {
  demon['affinities'] = (demon['inherits'] || '----------').split('').map(char => char === 'x' ? -1 : 0);
}

for (const skill of Object.values(SH2_SKILL_DATA)) {
  if (skill['rank']) { continue; }
  if (skill['cost']) { skill['rank'] = Math.ceil((skill['cost'] - 1000) / 5); }
  else { skill['rank'] = 1; }
}

for (const [name, prereq] of Object.entries(SH2_FUSION_PREREQS)) {
  SH2_DEMON_DATA[name].prereq = prereq;
}

export const SMT4_COMPENDIUM_CONFIG: CompendiumConfig = {
  appTitle: 'Soul Hackers 2',
  races: COMP_CONFIG_JSON.races,
  raceOrder: getEnumOrder(COMP_CONFIG_JSON.races),
  appCssClasses: ['smt4', 'sh2'],

  lang: 'en',
  engNames,
  affinityElems: affinityElems,
  skillData: SH2_SKILL_DATA,
  skillElems,
  elemOrder: getEnumOrder(skillElems),
  resistCodes: COMP_CONFIG_JSON.resistCodes,
  affinityBonuses: { costs: [], upgrades: [] },

  demonData: SH2_DEMON_DATA,
  evolveData: {},
  dlcDemons: COMP_CONFIG_JSON.dlcDemons,
  baseStats: COMP_CONFIG_JSON.baseStats,
  resistElems: COMP_CONFIG_JSON.resistElems,
  ailmentElems: [],

  normalTable: SH2_FUSION_CHART,
  elementTable: SH2_ELEMENT_CHART,
  specialRecipes: SH2_SPECIAL_RECIPES,

  settingsKey: 'sh2-fusion-tool-settings',
  settingsVersion: 2208081400
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
    [{ provide: COMPENDIUM_CONFIG, useValue: SMT4_COMPENDIUM_CONFIG }]
  ]
})
export class CompendiumModule { }
