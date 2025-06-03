import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumConfig, CompendiumConfigSet } from '../krch/models';
import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../compendium/constants';
import { skillRowToEffect } from '../pq2/models/skill-importer';

import COMP_CONFIG_JSON from './data/comp-config.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from '../desu1/data/element-chart.json';
import SPECIAL_RECIPES_JSON from './data/van-special-recipes.json';
import REC_SPECIAL_RECIPES_JSON from './data/rec-special-recipes.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';

import VAN_DEMON_DATA_JSON from './data/van-demon-data.json';
import VAN_SKILL_DATA_JSON from './data/van-skill-data.json';
import REC_DEMON_DATA_JSON from './data/rec-demon-data.json';
import REC_SKILL_DATA_JSON from './data/rec-skill-data.json';

import { FusionDataService } from '../krch/fusion-data.service';
import { SmtKuzuCompendiumModule } from '../krch/smt-kuzu-compendium.module';
import { CompendiumRoutingModule } from '../krch/compendium-routing.module';

function createCompConfig(): CompendiumConfigSet {
  const races = COMP_CONFIG_JSON.races;
  const rskillLookup = races.reduce((acc, r) => { acc[r] = []; return acc }, {});
  const resistElems = COMP_CONFIG_JSON.resistElems;
  const skillElems = resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const compConfigs: { [game: string]: CompendiumConfig } = {};
  const skillData = [];

  const COST_HP = 2 << 10;
  const COST_MP = (3 << 10) - 1000;

  for (const skillJson of [VAN_SKILL_DATA_JSON, REC_SKILL_DATA_JSON]) {
    const gameSkills = {};
    skillData.push(gameSkills);

    for (const row of Object.values(skillJson)) {
      const { a: [sname, elem, target], b: nums, c: descs } = row;
      const [rank, cost] = nums.slice(0, 2);
      const card = descs[2];

      if (rskillLookup[card]) { rskillLookup[card].push(sname); }
      gameSkills[sname] = {
        elem,
        rank,
        target: target === '-' ? 'Self' : target,
        cost: cost ? cost + (cost > 1000 ? COST_MP : COST_HP) : 0,
        effect: skillRowToEffect(nums, descs, false),
      }
    }
  }

  for (const dataJson of [VAN_DEMON_DATA_JSON, REC_DEMON_DATA_JSON]) {
    for (const entry of Object.values(dataJson)) {
      entry['skills'] = Object.assign({}, entry['command'] || {}, entry['passive'] || {});

      if (rskillLookup[entry.race]?.length === 2) {
        const [sname1, sname2] = rskillLookup[entry.race];
        entry['skills'][sname2] = 0;

        if (entry['raceup']) {
          entry['skills'][sname1] = 0;
          entry['skills'][sname2] = entry['raceup'];
        }
      }
    }

    for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
      if (dataJson[name]) {
        dataJson[name]['prereq'] = prereq
      }
    }
  }

  for (const [name, entry] of Object.entries(SPECIAL_RECIPES_JSON)) {
    REC_SPECIAL_RECIPES_JSON[name] = entry;
  }

  for (const game of ['ds2', 'ds2br']) {
    compConfigs[game] = {
      appTitle: 'Devil Survivor 2',
      appCssClasses: ['kuzu', 'ds2'],

      races,
      resistElems,
      skillElems,
      baseStats: COMP_CONFIG_JSON.baseStats,
      fusionLvlMod: 0.5,
      resistCodes: COMP_CONFIG_JSON.resistCodes,

      raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
      elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
      fissionCalculator: SMT_NORMAL_FISSION_CALCULATOR,
      fusionCalculator: SMT_NORMAL_FUSION_CALCULATOR,

      demonData: [VAN_DEMON_DATA_JSON],
      skillData: skillData.slice(0, 1),
      normalTable: FUSION_CHART_JSON,
      elementTable: ELEMENT_CHART_JSON,
      specialRecipes: SPECIAL_RECIPES_JSON,
      isDesu: true
    }
  }

  compConfigs.ds2br.appTitle = 'Devil Survivor 2 Record Breaker';
  compConfigs.ds2br.demonData = [VAN_DEMON_DATA_JSON, REC_DEMON_DATA_JSON];
  compConfigs.ds2br.skillData = skillData;
  compConfigs.ds2br.specialRecipes = REC_SPECIAL_RECIPES_JSON;

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
