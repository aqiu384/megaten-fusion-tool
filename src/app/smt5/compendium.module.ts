import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../smt4f/compendium-routing.module';
import { FusionDataService } from '../smt4f/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { Smt4CompendiumModule } from '../smt4f/smt4-compendium.module';
import { CompendiumConfig } from '../smt4f/models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import AFFINITIES_JSON from './data/affinity-bonuses.json';
import JA_NAMES_JSON from './data/ja-names.json';

function createCompConfig(): CompendiumConfig {
  const affinityElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.affinityElems);
  const skillElems = affinityElems.concat(COMP_CONFIG_JSON.skillElems);
  const affinityBonuses: { costs: number[][], upgrades: number[][] } = { costs: [], upgrades: [] };
  const skillData = {};

  for (const elem of affinityElems) {
    const bonusElem = AFFINITIES_JSON['elements'][elem];
    affinityBonuses.costs.push(AFFINITIES_JSON['costs'][bonusElem]);
    affinityBonuses.upgrades.push(AFFINITIES_JSON['upgrades'][bonusElem]);
  }

  const COST_MP = 3 << 10;
  const COST_MAG = 19 << 10;

  for (const skill of SKILL_DATA_JSON) {
    skillData[skill.name] = {
      element: skill.elem,
      cost: skill.cost ? (skill.cost < 2000 ? skill.cost + COST_MP - 1000 : COST_MAG) : 0,
      effect: skill.power ? skill.power + ' dmg' + (skill.effect ? ', ' + skill.effect : '') : skill.effect,
      target: skill.target || 'Self',
      rank: skill.rank
    }
  }

  for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
    DEMON_DATA_JSON[name].prereq = prereq;
  }

  return {
    appTitle: 'Shin Megami Tensei V',
    races: COMP_CONFIG_JSON.races,
    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    appCssClasses: ['smt4', 'smt5'],

    lang: 'en',
    jaNames: JA_NAMES_JSON,
    affinityElems,
    skillData,
    skillElems,
    elemOrder: skillElems.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    resistCodes: COMP_CONFIG_JSON.resistCodes,
    affinityBonuses,
    lvlModifier: 1,

    demonData: DEMON_DATA_JSON,
    evolveData: {},
    dlcDemons: COMP_CONFIG_JSON.dlcDemons,
    baseStats: COMP_CONFIG_JSON.baseStats,
    resistElems: COMP_CONFIG_JSON.resistElems,
    ailmentElems: COMP_CONFIG_JSON.ailments,

    normalTable: FUSION_CHART_JSON,
    elementTable: ELEMENT_CHART_JSON,
    specialRecipes: SPECIAL_RECIPES_JSON,

    settingsKey: 'smt5-fusion-tool-settings',
    settingsVersion: 2111141400,
    defaultRecipeDemon: 'Pixie',
    elementRace: 'Element'
  }
}

const SMT_COMP_CONFIG = createCompConfig();

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
    [{ provide: COMPENDIUM_CONFIG, useValue: SMT_COMP_CONFIG }]
  ]
})
export class CompendiumModule { }
