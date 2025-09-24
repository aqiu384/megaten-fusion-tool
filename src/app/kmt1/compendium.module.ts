import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from './compendium-routing.module';
import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { Kmt1CompendiumModule } from './kmt1-compendium.module';
import { CompendiumConfig } from './models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import ALIGNMENT_JSON from './data/alignments.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';

function createCompConfig(): CompendiumConfig {
  const resistElems = COMP_CONFIG_JSON['resistElems'];
  const skillElems = resistElems.concat(COMP_CONFIG_JSON['skillElems']);
  const races = [];

  for (const race of COMP_CONFIG_JSON['races']) {
    races.push(race);
  }

  const SPECIAL_RECIPES = {};

  for (const [demon, entry] of Object.entries(DEMON_DATA_JSON)) {
    if (entry.align.charAt(0) == 'e') {
      SPECIAL_RECIPES[demon] = { fusion: 'enemy', prereq: 'Enemy only' };
    }
  }

  const COST_MP = 3 << 10;
  const COST_EXTRA = 16 << 10;

  for (const entry of Object.values(SKILL_DATA_JSON)) {
    const cost = entry['cost'];
    const costType = COST_MP - 1000;
    entry['cost'] = cost ? cost + costType: COST_EXTRA;
  }

  return {
    appTitle: 'Kyūyaku Megami Tensei: Megami Tensei I',
    appCssClasses: ['kmt', 'kmt1'],
    races,
    resistElems,
    skillElems,
    baseStats: COMP_CONFIG_JSON['baseStats'],
    baseAtks: COMP_CONFIG_JSON['baseAtks'],

    resistCodes: COMP_CONFIG_JSON['resistCodes'],
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),

    demonData: DEMON_DATA_JSON,
    skillData: SKILL_DATA_JSON,
    alignData: ALIGNMENT_JSON,
    normalTable: FUSION_CHART_JSON,
    specialRecipes: SPECIAL_RECIPES
  }
}

const SMT_COMP_CONFIG = createCompConfig();

@NgModule({
  imports: [
    CommonModule,
    Kmt1CompendiumModule,
    CompendiumRoutingModule
  ],
  providers: [
    Title,
    FusionDataService,
    { provide: FUSION_DATA_SERVICE, useExisting: FusionDataService },
    { provide: COMPENDIUM_CONFIG, useValue: SMT_COMP_CONFIG }
  ]
})
export class CompendiumModule { }
