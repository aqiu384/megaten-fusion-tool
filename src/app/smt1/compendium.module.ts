import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from './compendium-routing.module';
import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { SmtSnesCompendiumModule } from './smt-snes-compendium.module';
import { CompendiumConfig } from './models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import ALIGNMENT_JSON from './data/alignments.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import TRIPLE_CHART_JSON from './data/triple-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';

function createCompConfig(): CompendiumConfig {
  const RECRUIT_RACES = [ 'Messian', 'Gaean' ];
  const resistElems = COMP_CONFIG_JSON['resistElems'];
  const skillElems = resistElems.concat(COMP_CONFIG_JSON['skillElems']);
  const races = [];
  const speciesLookup = {};
  const species = {};

  for (const rs of COMP_CONFIG_JSON['species']) {
    species[rs[0]] = rs.slice(1);

    for (const race of rs) {
      races.push(race);
    }

    for (const race of rs.slice(1)) {
      speciesLookup[race] = rs[0];
    }
  }

  for (const [name, demon] of Object.entries(DEMON_DATA_JSON)) {
    demon['resists'] = demon['resists'].slice(0, 7).concat(demon['resists'].slice(8));

    if (RECRUIT_RACES.indexOf(demon.race) !== -1) {
      SPECIAL_RECIPES_JSON[name] = { fusion: 'recruit', prereq: 'Recruitment only' };
    } else if (demon.race === 'Machine') {
      SPECIAL_RECIPES_JSON[name] = { fusion: 'enemy', prereq: 'Enemy only' };
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
    appTitle: 'Shin Megami Tensei',
    appCssClasses: ['smtnes', 'smt1'],
    races,
    resistElems,
    skillElems,
    baseStats: COMP_CONFIG_JSON['baseStats'],
    baseAtks: COMP_CONFIG_JSON['baseAtks'],

    speciesLookup,
    species,
    resistCodes: COMP_CONFIG_JSON['resistCodes'],
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    useSpeciesFusion: true,

    normalLvlModifier: 1.5,
    tripleLvlModifier: 7.25,
    demonData: DEMON_DATA_JSON,
    skillData: SKILL_DATA_JSON,
    alignData: ALIGNMENT_JSON,
    normalTable: FUSION_CHART_JSON,
    tripleTable: TRIPLE_CHART_JSON,
    elementTable: ELEMENT_CHART_JSON,
    mitamaTable: ELEMENT_CHART_JSON['pairs'],
    specialRecipes: SPECIAL_RECIPES_JSON
  }
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
