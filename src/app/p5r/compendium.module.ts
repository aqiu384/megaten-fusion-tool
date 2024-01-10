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

import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';

function createCompConfig(): CompendiumConfig {
  const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const inheritTypes: { [elem: string]: number } = {};
  const races = [];

  for(const race of COMP_CONFIG_JSON.races) {
    races.push(race);
    races.push(race + ' P');
  }

  for (let i = 0; i < INHERIT_TYPES_JSON.inherits.length; i++) {
    inheritTypes[INHERIT_TYPES_JSON.inherits[i]] = parseInt(INHERIT_TYPES_JSON.ratios[i], 2);
  }

  for (const json of [DEMON_DATA_JSON, DLC_DATA_JSON, PARTY_DATA_JSON]) {
    for (const entry of Object.values(json)) {
      entry['skills'][entry['trait']] = 0;
    }
  }

  for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
    DEMON_DATA_JSON[name].prereq = prereq;
  }

  for (const entry of Object.values(ENEMY_DATA_JSON)) {
    entry['exp'] = 0;
    entry['yen'] = 0;
    entry['stats'] = entry['stats'] ?
      [entry['stats'][0], Math.floor(entry['stats'][0] * 0.66)] :
      [entry.lvl * 15, entry.lvl * 10];
    entry['stats'] = entry['stats'].concat([0, 0, 0, 0, 0]);
    entry['area'] = [entry['areas']];
  }

  const COST_HP = 2 << 24;
  const COST_MP = 3 << 24;

  for (const skills of [VAN_SKILL_DATA_JSON, ROY_SKILL_DATA_JSON]) {
    for (const entry of Object.values(skills)) {
      const cost = entry['cost'];
      const costType = cost > 1000 ? COST_MP - 1000 : COST_HP;
      entry['normCost'] = cost ? cost + costType: 0;

      const effect = [];
      if (entry['power']) { effect.push(`√${entry['power']} power`); }
      if (entry['min']) { effect.push(`${entry['min']}${entry['max'] ? '-' + entry['max'] : ''} hits`); }
      if (entry['hit'] && entry['hit'] < 80) { effect.push(`${entry['hit']}% hit`); }
      if (entry['crit'] && entry['crit'] != 5) { effect.push(`${entry['crit']}% crit`); }

      if (entry['mod']) {
        const mod = entry['mod'];
        const add = entry['add'];
        effect.push(mod < 1000 ? `${mod}% ${add}` : `x${(mod / 100 - 10).toFixed(2)} ${add}`);
      } else if (entry['add']) {
        effect.push(entry['add']);
      }

      entry['effect'] = effect.join(', ');
    }
  }

  return {
    appTitle: 'Persona 5 Royal',

    races,
    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    baseStats: COMP_CONFIG_JSON.baseStats,
    skillElems,
    resistElems: COMP_CONFIG_JSON.resistElems,
    resistCodes: COMP_CONFIG_JSON.resistCodes,
    elemOrder: skillElems.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    inheritTypes,
    inheritElems: INHERIT_TYPES_JSON.elems,

    enemyStats: ['HP', 'MP'],
    enemyResists: COMP_CONFIG_JSON.resistElems,

    demonData: [DEMON_DATA_JSON, DLC_DATA_JSON, PARTY_DATA_JSON],
    skillData: [VAN_SKILL_DATA_JSON, ROY_SKILL_DATA_JSON],
    enemyData: [ENEMY_DATA_JSON],

    normalTable: FUSION_CHART_JSON,
    elementTable: ELEMENT_CHART_JSON,
    specialRecipes: SPECIAL_RECIPES_JSON,

    dlcDemons: COMP_CONFIG_JSON.dlcDemons,
    downloadedDemons: COMP_CONFIG_JSON.downloadedDemons,
    settingsKey: 'p5r-fusion-tool-settings',
    settingsVersion: 2211092300
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
