import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../smt4f/compendium-routing.module';
import { FusionDataService } from '../smt4f/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { Smt4CompendiumModule } from '../smt4f/smt4-compendium.module';
import { CompendiumConfig, CompendiumConfigSet } from '../smt4f/models';
import { skillRowToEffect } from '../pq2/models/skill-importer';

import COMP_CONFIG_JSON from './data/comp-config.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from '../desu1/data/element-chart.json';
import PRICE_PBOX_JSON from '../desu1/data/price-pbox.json';

import VAN_DEMON_DATA_JSON from './data/van-demon-data.json';
import VAN_SKILL_DATA_JSON from './data/van-skill-data.json';
import VAN_DEMON_UNLOCKS_JSON from './data/van-demon-unlocks.json';
import SPECIAL_RECIPES_JSON from './data/van-special-recipes.json';
import REC_DEMON_DATA_JSON from './data/rec-demon-data.json';
import REC_SKILL_DATA_JSON from './data/rec-skill-data.json';
import REC_DEMON_UNLOCKS_JSON from './data/rec-demon-unlocks.json';
import REC_SPECIAL_RECIPES_JSON from './data/rec-special-recipes.json';

function estimateDesuPrice(demon, statPrices: number[], skillPrices: { [skill: string]: number }): number {
  const stats = <number[]>demon.stats;
  const statPrice = statPrices[stats.slice(stats.length - 4).reduce((acc, s) => acc + s, 0)];
  const skills = <{ [skill: string]: number }>demon.skills;
  const skillPrice = Object.entries(skills).reduce((acc, [sname, slvl]) => acc + (slvl < 2 ? skillPrices[sname] : 0), 0);
  return statPrice + skillPrice + (demon.race === 'Element' ? 1000 : demon.race === 'Mitama' ? 3000 : 0) / 2;
}

function createCompConfig(): CompendiumConfigSet {
  const races = COMP_CONFIG_JSON.races;
  const rskillLookup = races.reduce((acc, r) => { acc[r] = []; return acc }, {});
  const resistElems = COMP_CONFIG_JSON.resistElems;
  const skillElems = resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const compConfigs: { [game: string]: CompendiumConfig } = {};
  const skillData = [];

  const statPrices = Array<number>(PRICE_PBOX_JSON.statTable.length + 1).fill(0);
  const skillRanks = Array<number>(PRICE_PBOX_JSON.skillTable.length + 1).fill(0);
  const skillPrices = {}

  statPrices[0] = PRICE_PBOX_JSON.statBase;
  let statStep = PRICE_PBOX_JSON.statStep;

  for (let i = 1; i < statPrices.length; i++) {
    statStep += PRICE_PBOX_JSON.statTable[i - 1];
    statPrices[i] = statPrices[i - 1] + statStep;
  }

  for (let i = 1; i < skillRanks.length; i++) {
    skillRanks[i] = skillRanks[i - 1] + PRICE_PBOX_JSON.skillTable[i - 1] / 2;
  }

  const COST_HP = 2 << 10;
  const COST_MP = (3 << 10) - 1000;

  for (const skillJson of [VAN_SKILL_DATA_JSON, REC_SKILL_DATA_JSON]) {
    const gameSkills = {};
    skillData.push(gameSkills);

    for (const row of Object.values(skillJson)) {
      const { a: [sname, element, target], b: nums, c: descs } = row;
      const [rank, cost] = nums.slice(0, 2);
      const card = descs[2];

      if (rskillLookup[card]) { rskillLookup[card].push(sname); }

      skillPrices[sname] = skillRanks[rank];
      gameSkills[sname] = {
        element,
        rank: rank < 50 ? rank : 0,
        target: target === '-' ? 'Self' : target,
        cost: cost ? cost + (cost > 1000 ? COST_MP : COST_HP) : 0,
        effect: skillRowToEffect(nums, descs, false),
      }
    }
  }

  for (const dataJson of [VAN_DEMON_DATA_JSON, REC_DEMON_DATA_JSON]) {
    for (const entry of Object.values(dataJson)) {
      entry['stats'] = [entry['unique'] ? 1 : 0].concat(entry['stats'])
      entry['skills'] = Object.assign({}, entry['command'] || {}, entry['passive'] || {});
      entry['price'] = estimateDesuPrice(entry, statPrices, skillPrices);

      if (rskillLookup[entry.race]?.length === 2) {
        const [sname1, sname2] = rskillLookup[entry.race];
        entry['skills'][sname2] = 0;

        if (entry['raceup']) {
          entry['skills'][sname1] = 0;
          entry['skills'][sname2] = entry['raceup'];
        }
      }
    }
  }

  for (const [name, entry] of Object.entries(SPECIAL_RECIPES_JSON)) {
    REC_SPECIAL_RECIPES_JSON[name] = entry;
  }

  for (const game of ['ds2', 'ds2br']) {
    compConfigs[game] = {
      appTitle: 'Devil Survivor 2',
      races: COMP_CONFIG_JSON.races,
      raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
      appCssClasses: ['smt4', 'ds2'],

      lang: 'en',
      affinityElems: [],
      skillData: skillData.slice(0, 1),
      fusionSpells: {},
      skillElems,
      elemOrder: skillElems.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
      resistCodes: COMP_CONFIG_JSON.resistCodes,
      affinityBonuses: { costs: [], upgrades: [] },
      lvlModifier: 0.5,
      maxSkillSlots: 7,
      hasLightDark: false,

      demonData: [VAN_DEMON_DATA_JSON],
      evolveData: {},
      alignments: {},
      baseStats: COMP_CONFIG_JSON.baseStats,
      resistElems: COMP_CONFIG_JSON.resistElems,
      ailmentElems: [],

      demonUnlocks: VAN_DEMON_UNLOCKS_JSON,
      normalTable: FUSION_CHART_JSON,
      elementTable: ELEMENT_CHART_JSON,
      specialRecipes: SPECIAL_RECIPES_JSON,

      settingsKey: 'ds2-fusion-tool-settings',
      settingsVersion: 2401131500,
      defaultRecipeDemon: 'Pixie',
      elementRace: 'Element'
    };
  }

  compConfigs.ds2br.appTitle = 'Devil Survivor 2 Record Breaker';
  compConfigs.ds2br.settingsKey = 'ds2br-fusion-tool-settings';
  compConfigs.ds2br.demonData = [VAN_DEMON_DATA_JSON, REC_DEMON_DATA_JSON];
  compConfigs.ds2br.skillData = skillData;
  compConfigs.ds2br.specialRecipes = REC_SPECIAL_RECIPES_JSON;
  compConfigs.ds2br.demonUnlocks = VAN_DEMON_UNLOCKS_JSON.concat(<[]>REC_DEMON_UNLOCKS_JSON);

  return {
    appTitle: 'Devil Survivor 2',
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
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
