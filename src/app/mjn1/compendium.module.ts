import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../smt1/compendium-routing.module';
import { FusionDataService } from '../smt1/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { SmtSnesCompendiumModule } from '../smt1/smt-snes-compendium.module';
import { CompendiumConfig } from '../smt1/models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';

function createCompConfig(): CompendiumConfig {
  const races = [];
  const resistElems = races.map(r => r.slice(0, 3)).slice(0, 23);
  const skillElems = COMP_CONFIG_JSON.skillElems.map(r => r.slice(0, 3));
  const demonData = {};
  const skillData = {};

  for (const rs of COMP_CONFIG_JSON['species']) {
    for (const race of rs) {
      races.push(race);
    }
  }

  for (const [dname, entry] of Object.entries(DEMON_DATA_JSON)) {
    const nentry = Object.assign({}, entry);
    nentry['person'] = entry.race;
    nentry['stats'] = entry.stats.slice(0, 8);
    nentry['resists'] = '';
    nentry['skills'] = entry['skills'] || [];
    demonData[dname] = nentry;
  }

  const COST_MP = 3 << 10;

  for (const [sname, entry] of Object.entries(SKILL_DATA_JSON)) {
    const nentry = Object.assign({}, entry);
    nentry['elem'] = entry.element;
    nentry['cost'] = entry['cost'] ? entry['cost'] + COST_MP - 1000 : 0;
    skillData[sname] = nentry;
  }

  return {
    appTitle: 'Majin Tensei',
    appCssClasses: ['smtnes', 'mjn1'],
    races,
    resistElems,
    skillElems,
    baseStats: COMP_CONFIG_JSON.baseStats,
    baseAtks: [],

    speciesLookup: {},
    species: {},
    resistCodes: COMP_CONFIG_JSON.resistCodes,
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    specialRecipes: {},
    useSpeciesFusion: true,

    normalLvlModifier: 1.5,
    tripleLvlModifier: 2.25,
    demonData: demonData,
    skillData: skillData,
    alignData: { races: races.reduce((acc, r) => { acc[r] = 'nn'; return acc; }, {}) },
    normalTable: FUSION_CHART_JSON,
    tripleTable: { races: ['DEITIES'], table: ['-'] },
    elementTable: { elems: [], races: [], table: [] }
  };
}

const SMT_COMP_CONFIG = createCompConfig();

@NgModule({
  imports: [
    CommonModule,
    SmtSnesCompendiumModule,
    CompendiumRoutingModule
  ],
  providers: [
    Title,
    FusionDataService,
    { provide: FUSION_DATA_SERVICE, useExisting: FusionDataService },
    { provide: FUSION_TRIO_SERVICE, useExisting: FusionDataService },
    { provide: COMPENDIUM_CONFIG, useValue: SMT_COMP_CONFIG }
  ]
})
export class CompendiumModule { }
