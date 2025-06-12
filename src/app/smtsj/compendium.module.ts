import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../smt4f/compendium-routing.module';
import { FusionDataService } from '../smt4f/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { Smt4CompendiumModule } from '../smt4f/smt4-compendium.module';
import { CompendiumConfig, CompendiumConfigSet } from '../smt4f/models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import ALIGNMENTS_JSON from './data/alignments.json';
import DEMON_CODES_JSON from './data/demon-codes.json'
import SKILL_CODES_JSON from './data/skill-codes.json'

import DEMON_DATA_JSON from './data/demon-data.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';

import REDUX_DEMON_DATA_JSON from './data/redux-demon-data.json';
import REDUX_SPECIAL_RECIPES_JSON from './data/redux-special-recipes.json';
import REDUX_DEMON_UNLOCKS_JSON from './data/redux-demon-unlocks.json';

function skillRowToEffect(entry) {
  return entry.power ? entry.power + ' dmg' + (entry.effect ? ', ' + entry.effect : '') : entry.effect;
}

function estimateBasePrice(stats: number[], pcoeff: number): number {
  const x = stats.slice(2).reduce((acc, stat) => stat + acc, 0);
  return Math.floor((Math.floor(pcoeff * Math.pow(x, 3) / 1000) + 1300) * 0.75);
}

function createCompConfig(): CompendiumConfigSet {
  const demonCodes = DEMON_CODES_JSON.reduce((acc, name, code) => { acc[name] = code; return acc }, {});
  const skillCodes = SKILL_CODES_JSON.reduce((acc, name, code) => { acc[name] = code; return acc }, {});
  const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const compConfigs: { [game: string]: CompendiumConfig } = {};
  const demonDatas = [];
  const skillData = {};
  const skillPrices = {};

  const gameDatas = [
    [DEMON_DATA_JSON, FUSION_PREREQS_JSON, SPECIAL_RECIPES_JSON],
    [REDUX_DEMON_DATA_JSON, {}, REDUX_SPECIAL_RECIPES_JSON],
  ]

  for (const [demons, prereqs, specials] of gameDatas) {
    const demonData = {};
    demonDatas.push(demonData);

    for (const [name, entry] of Object.entries(demons)) {
      demonData[name] = Object.assign({}, entry);
      demonData[name].code = demonCodes[name];
      demonData[name].skills = entry.skills.reduce((acc, s, i) => { acc[s] = i - 3; return acc; }, {});
      demonData[name].skillCards = entry.source.reduce((acc, s, i) => { acc[s] = i - 3; return acc; }, {});
      demonData[name].price = estimateBasePrice(entry.stats, entry.pcoeff) / 2;
      demonData[name].affinities = entry.inherits.split('').map(i => i === 'o' ? 10 : -10);
    }

    for (const [name, prereq] of Object.entries(prereqs)) {
      demonData[name].prereq = prereq;
      demonData[name].fusion = 'accident';
      specials[name] = [];
    }
  }

  const COST_MP = (3 << 10) - 1000;

  for (const row of Object.values(SKILL_DATA_JSON)) {
    const { cost, elem, name, rank, target } = row;
    skillPrices[name] = COMP_CONFIG_JSON.skillRankPrices[rank];
    skillData[name] = {
      code: skillCodes[name],
      element: elem,
      rank: Math.min(rank, 99),
      target: target || 'Self',
      cost: cost === 0 ? 0 : cost + COST_MP,
      effect: skillRowToEffect(row)
    }
  }

  for (const game of ['smtsj', 'smtdsj']) {
    compConfigs[game] = {
      appTitle: 'Shin Megami Tensei: Strange Journey',
      races: COMP_CONFIG_JSON.races,
      raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
      appCssClasses: ['smt4', 'smtsj'],

      lang: 'en',
      affinityElems: COMP_CONFIG_JSON.inheritElems,
      skillData: [skillData],
      fusionSpells: {},
      skillElems,
      elemOrder: skillElems.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
      resistCodes: COMP_CONFIG_JSON.resistCodes,
      affinityBonuses: { costs: [], upgrades: [] },
      lvlModifier: 1,
      maxSkillSlots: 6,
      hasLightDark: true,
      hasSkillRanks: true,
      hasNonelemInheritance: true,

      demonData: demonDatas.slice(0, 1),
      evolveData: {},
      alignments: ALIGNMENTS_JSON,
      baseStats: COMP_CONFIG_JSON.baseStats,
      resistElems: COMP_CONFIG_JSON.resistElems,
      ailmentElems: COMP_CONFIG_JSON.ailments,

      demonUnlocks: DEMON_UNLOCKS_JSON,
      normalTable: FUSION_CHART_JSON,
      elementTable: ELEMENT_CHART_JSON,
      specialRecipes: SPECIAL_RECIPES_JSON,

      settingsKey: 'smtsj-fusion-tool-settings',
      settingsVersion: 2401131500,
      defaultRecipeDemon: 'Pixie',
      elementRace: 'Element'
    };
  }

  compConfigs.smtdsj.appTitle = 'Shin Megami Tensei: Strange Journey Redux';
  compConfigs.smtdsj.appCssClasses = ['smt4', 'smtsj', 'smtdsj'];
  compConfigs.smtdsj.settingsKey = 'smtdsj-fusion-tool-settings';
  compConfigs.smtdsj.demonData = demonDatas;
  compConfigs.smtdsj.demonUnlocks = DEMON_UNLOCKS_JSON.concat(<[]>REDUX_DEMON_UNLOCKS_JSON);
  compConfigs.smtdsj.specialRecipes = Object.assign({}, SPECIAL_RECIPES_JSON, REDUX_SPECIAL_RECIPES_JSON);
  delete compConfigs.smtdsj.specialRecipes['Alciel'];
  delete compConfigs.smtdsj.specialRecipes['Demonee-ho'];

  return {
    appTitle: 'Shin Megami Tensei: Strange Journey',
    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
    configs: compConfigs
  };
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
