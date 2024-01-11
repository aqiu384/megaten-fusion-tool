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
import TRIPLE_CHART_JSON from './data/triple-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';

function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

function createCompConfig(): CompendiumConfig {
  const ENEMY_RACES = [ 'Soshin', 'Herald', 'Machine', 'Human' ];
  const resistElems = COMP_CONFIG_JSON.resistElems.map(r => r.slice(0, 3));
  const skillElems = resistElems.concat(COMP_CONFIG_JSON.skillElems.map(r => r.slice(0, 3)));
  const races = [];
  const raceAligns = {};
  const species = {};
  const speciesLookup = {};

  for (const rs of COMP_CONFIG_JSON.species) {
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

  for (const [demon, entry] of Object.entries(DEMON_DATA_JSON)) {
    entry['resists'] = COMP_CONFIG_JSON.raceRes[entry.race];
    entry.atks = entry.atks.slice(0, 2);
    entry['skills'] = entry['skills'] || [];

    if (entry.race === 'Vile' && !SPECIAL_RECIPES_JSON[demon]) {
      SPECIAL_RECIPES_JSON[demon] = { fusion: 'normal', prereq: 'Defeat to unlock fusion' };
    } else if (ENEMY_RACES.indexOf(entry.race) !== -1) {
      SPECIAL_RECIPES_JSON[demon] = { fusion: 'enemy', prereq: 'Enemy only' };
    }
  }

  const ELEMENTS = ['Salamander', 'Undine', 'Sylph', 'Gnome'];
  const ELEM_PAIRS = [ ['Mou-Ryo', 'Black Ooze', 'Slime'], ['Mou-Ryo', 'Black Ooze'], ['Mou-Ryo'], [] ];
  const ELEM_TABLE = [];

  for (const row of FUSION_CHART_JSON.table) {
    const erow = [-1, -1, -1, -1];
    const eind = ELEMENTS.indexOf(row[row.length - 1]);
    ELEM_TABLE.push(erow);

    if (eind > -1) {
      erow[eind] = 1;
    }
  }

  for (const [name, recipe] of Object.entries(SPECIAL_RECIPES_JSON)) {
    if (recipe.fusion === 'accident') {
      recipe['prereq'] = 'Fusion accident only';
    } else if (recipe.fusion === 'recruit') {
      recipe['prereq'] = 'Recruitment only';
    } else if (recipe['prereq'] === 'defeat') {
      recipe['prereq'] = 'Defeat to unlock fusion';
    }
  }

  const COST_MP = 3 << 10;

  for (const entry of Object.values(SKILL_DATA_JSON)) {
    entry['cost'] = entry['cost'] ? entry['cost'] + COST_MP - 1000 : 0;
  }

  return {
    appTitle: 'Majin Tensei II: Spiral Nemesis',
    appCssClasses: ['smtnes', 'mjn2'],
    races,
    resistElems,
    skillElems,
    baseStats: COMP_CONFIG_JSON.baseStats,
    baseAtks: COMP_CONFIG_JSON.baseAtks,

    speciesLookup,
    species,
    resistCodes: COMP_CONFIG_JSON.resistCodes,
    raceOrder: getEnumOrder(races),
    elemOrder: getEnumOrder(skillElems),
    specialRecipes: SPECIAL_RECIPES_JSON,
    useSpeciesFusion: true,

    normalLvlModifier: 1.5,
    tripleLvlModifier: 2.25,
    demonData: DEMON_DATA_JSON,
    skillData: SKILL_DATA_JSON,
    alignData: { races: raceAligns },
    normalTable: FUSION_CHART_JSON,
    tripleTable: TRIPLE_CHART_JSON,
    mitamaTable: ELEM_PAIRS,
    elementTable: {
      elems: ELEMENTS,
      races: FUSION_CHART_JSON.races,
      table: ELEM_TABLE
    }
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
