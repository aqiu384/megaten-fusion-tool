import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumConfig } from '../krch/models';
import { NormalFusionCalculator } from '../compendium/models/normal-fusion-calculator';
import { splitMajinByRank, fuseMajinByRank } from '../compendium/fusions/mjn-rank-fusions';
import {
  COMPENDIUM_CONFIG,
  FUSION_DATA_SERVICE,
} from '../compendium/constants';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';

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

const MJN1_FUSION_CALCULATOR = new NormalFusionCalculator([ fuseMajinByRank ], [ ]);
const MJN1_FISSION_CALCULATOR = new NormalFusionCalculator([ splitMajinByRank ], [ ]);

const races = [];
const resistElems = races.map(r => r.slice(0, 3)).slice(0, 23);
const skillElems = COMP_CONFIG_JSON.skillElems.map(r => r.slice(0, 3));

for (const rs of COMP_CONFIG_JSON['species']) {
  for (const race of rs) {
    races.push(race);
  }
}

for (const [demon, entry] of Object.entries(DEMON_DATA_JSON)) {
  entry.stats = entry.stats.slice(0, 8);
  entry['person'] = entry.race;
  entry['nskills'] = (entry['skills'] || []).reduce((acc, s) => { acc[s] = 0; return acc; }, {});
  entry['resists'] = '';
}

for (const [skill, entry] of Object.entries(SKILL_DATA_JSON)) {
  entry['elem'] = entry.element;
  entry['target'] = (entry['target'] || 'Self') + (entry['range'] ? ' ' + entry['range'] : '');
  entry['effect'] = entry['effect'] || entry['power'] + ' dmg';
}

export const SMT_COMP_CONFIG: CompendiumConfig = {
  appTitle: 'Majin Tensei',
  gameTitles: { mjn1: 'Majin Tensei' },
  appCssClasses: ['kuzu', 'mjn1'],

  races,
  resistElems: [],
  skillElems,
  baseStats: COMP_CONFIG_JSON.baseStats,
  fusionLvlMod: 2.5,
  resistCodes: {},

  raceOrder: getEnumOrder(races),
  elemOrder: getEnumOrder(skillElems),
  fissionCalculator: MJN1_FISSION_CALCULATOR,
  fusionCalculator: MJN1_FUSION_CALCULATOR,

  demonData: { mjn1: [DEMON_DATA_JSON] },
  skillData: { mjn1: [SKILL_DATA_JSON] },
  normalTable: FUSION_CHART_JSON,
  elementTable: { elems: [], races: [], table: [] },
  mitamaTable: [],
  specialRecipes: { mjn1: {} }
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
