import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../smt1/compendium-routing.module';
import { FusionDataService } from '../smt1/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { SmtSnesCompendiumModule } from '../smt1/smt-snes-compendium.module';
import { CompendiumConfig } from '../smt1/models';

import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import COMP_CONFIG_JSON from './data/comp-config.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import DARK_CHART_JSON from './data/dark-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';

function createCompConfig(): CompendiumConfig {
  const resistElems = COMP_CONFIG_JSON['resistElems'];
  const skillElems = resistElems.concat(COMP_CONFIG_JSON['skillElems']);

  const races = [];
  const raceAligns = {};
  const species = {};
  const speciesLookup = {};

  for (const rs of COMP_CONFIG_JSON['species']) {
    const spec = rs[0];
    species[spec] = [];

    for (const pair of rs.slice(1)) {
      const [race, align] = pair.split('|');
      races.push(race);
      raceAligns[race] = align;
      species[spec].push(race);
      speciesLookup[race] = spec;
    }
  }

  for (const [name, demon] of Object.entries(DEMON_DATA_JSON)) {
    demon['resists'] = demon['resists'].slice(0, 9).concat(demon['resists'].slice(11));
  }

  const COST_HP = 2 << 10;
  const COST_MP = 3 << 10;
  const COST_MG = 9 << 10;

  for (const entry of Object.values(SKILL_DATA_JSON)) {
    const cost = entry['cost'];
    const costType = cost > 1000 ? (cost > 2000 ? COST_MG - 2000 : COST_MP - 1000) : COST_HP;
    entry['cost'] = cost ? cost + costType: 0;
  }

  const normalElemChart = {
    elems: ELEMENT_CHART_JSON['elems'].slice(0, 4),
    races: ELEMENT_CHART_JSON['races'],
    table: ELEMENT_CHART_JSON['table'].map(row => row.slice(0, 4))
  };

  const tripleElemChart = {
    elems: ELEMENT_CHART_JSON['elems'].slice(4, 10),
    races: ELEMENT_CHART_JSON['races'],
    table: ELEMENT_CHART_JSON['table'].map(row => row.slice(4, 10))
  };

  const normalChart = {
    races: FUSION_CHART_JSON['races'],
    table: FUSION_CHART_JSON['table'].map((row, i) => row.slice(i, row.length))
  };

  const tripleChart = {
    races: FUSION_CHART_JSON['races'],
    table: FUSION_CHART_JSON['table'].map((row, i) => row.slice(0, i + 1))
  };

  return {
    appTitle: 'Shin Megami Tensei NINE',
    appCssClasses: ['smtnes', 'smt9'],
    races,
    resistElems,
    skillElems,
    baseStats: COMP_CONFIG_JSON['baseStats'],
    baseAtks: [],

    speciesLookup,
    species,
    resistCodes: COMP_CONFIG_JSON['resistCodes'],
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    useSpeciesFusion: false,
    specialRecipes: SPECIAL_RECIPES_JSON,

    normalLvlModifier: 2.5,
    tripleLvlModifier: 2.25,
    demonData: DEMON_DATA_JSON,
    skillData: SKILL_DATA_JSON,
    alignData: { races: raceAligns },
    normalTable: normalChart,
    darkTable: DARK_CHART_JSON,
    mitamaTable: ELEMENT_CHART_JSON['pairs'],
    tripleTable: tripleChart,
    elementTable: normalElemChart,
    tripleElementTable: tripleElemChart,
    tripleMitamaTable: ELEMENT_CHART_JSON['triples']
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
