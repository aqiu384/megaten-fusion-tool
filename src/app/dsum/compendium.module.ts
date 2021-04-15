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
import FUSION_CHART_JSON from './data/norm-chart.json';
import DARK_CHART_JSON from './data/dark-chart.json';
import TRIPLE_CHART_JSON from './data/norm-triple-chart.json';
import DARK_TRIPLE_CHART_JSON from './data/dark-triple-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';

function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

const resistElems = COMP_CONFIG_JSON['resistElems'];
const skillElems = resistElems.concat(COMP_CONFIG_JSON['skillElems']);

const races = [];
const raceAligns = {};
const species = {};
const speciesLookup = {};
const DEITIES = [];
const BEASTS = [];

const normalTable = {
  races: FUSION_CHART_JSON['races'].concat(['Mitama']),
  table: FUSION_CHART_JSON['table'].concat(Array(races.length + 1).fill('-')),
}

const tripleTable = {
  races: TRIPLE_CHART_JSON['races'].concat(['Mitama']),
  table: TRIPLE_CHART_JSON['table'].concat(Array(races.length + 1).fill('-')),
}

const normalElemChart = {
  elems: ELEMENT_CHART_JSON['elems'].slice(0, 4),
  races: ELEMENT_CHART_JSON['races'],
  table: ELEMENT_CHART_JSON['table'].map(row => row.slice(0, 4))
}

const tripleElemChart = {
  elems: ELEMENT_CHART_JSON['elems'].slice(4, 10),
  races: ELEMENT_CHART_JSON['races'],
  table: ELEMENT_CHART_JSON['table'].map(row => row.slice(4, 10))
};

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
  demon['resists'] = demon['resists'].slice(4, 8).concat(demon['resists'].slice(9));

  switch (demon.race) {
    case 'Deity':
    case 'Megami':
      DEITIES.push(name);
      break;
    case 'Avatar':
    case 'Holy':
    case 'Beast':
    case 'Wilder':
      BEASTS.push(name);
      break;
    case 'Enigma':
      SPECIAL_RECIPES_JSON[name] = {
        fusion: 'accident',
        prereq: 'Trigger fusion accident using one of the following ingredients during new moon',
        special: DEITIES
      }
      break;
    case 'UMA':
      SPECIAL_RECIPES_JSON[name] = {
        fusion: 'accident',
        prereq: 'Trigger fusion accident using one of the following ingredients during full moon',
        special: BEASTS
      };
      break;
    default:
      break;
  }
}

export const SMT_COMP_CONFIG: CompendiumConfig = {
  appTitle: 'Shin Megami Tensei: Devil Summoner',
  appCssClasses: ['smtnes', 'dsum'],
  races,
  resistElems,
  skillElems,
  baseStats: COMP_CONFIG_JSON['baseStats'],
  baseAtks: COMP_CONFIG_JSON['baseAtks'],

  speciesLookup,
  species,
  resistCodes: COMP_CONFIG_JSON['resistCodes'],
  raceOrder: getEnumOrder(races),
  elemOrder: getEnumOrder(skillElems),
  useSpeciesFusion: false,

  normalLvlModifier: 2.5,
  tripleLvlModifier: 3.25,
  demonData: DEMON_DATA_JSON,
  skillData: SKILL_DATA_JSON,
  alignData: { races: raceAligns },
  specialRecipes: SPECIAL_RECIPES_JSON,

  normalTable,
  darkTable: DARK_CHART_JSON,
  elementTable: normalElemChart,
  mitamaTable: ELEMENT_CHART_JSON['pairs'],

  tripleTable,
  tripleDarkTable: DARK_TRIPLE_CHART_JSON,
  tripleElementTable: tripleElemChart,
  tripleMitamaTable: ELEMENT_CHART_JSON['triples']
};

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
