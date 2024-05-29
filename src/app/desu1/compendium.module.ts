import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumConfig, CompendiumConfigSet } from '../krch/models';
import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../compendium/constants';
import { skillRowToEffect } from '../pq2/models/skill-importer';

import COMP_CONFIG_JSON from './data/comp-config.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';

import VAN_DEMON_DATA_JSON from './data/van-demon-data.json';
import VAN_SKILL_DATA_JSON from './data/van-skill-data.json';
import OVE_DEMON_DATA_JSON from './data/ove-demon-data.json';

import { FusionDataService } from '../krch/fusion-data.service';
import { SmtKuzuCompendiumModule } from '../krch/smt-kuzu-compendium.module';
import { CompendiumRoutingModule } from '../krch/compendium-routing.module';

function createCompConfig(): CompendiumConfigSet {
  const races = COMP_CONFIG_JSON.races;
  const resistElems = COMP_CONFIG_JSON.resistElems;
  const skillElems = resistElems.concat(COMP_CONFIG_JSON.skillElems);
  console.log(skillElems)
  const compConfigs: { [game: string]: CompendiumConfig } = {};
  const skillData = {};
  const MITAMA_TABLE = [
    ['Nigi', 'Ara ', 'Kusi'],
    ['Kusi', 'Ara '],
    ['Saki'],
    []
  ];

  const COST_HP = 2 << 10;
  const COST_MP = (3 << 10) - 1000;

  for (const row of Object.values(VAN_SKILL_DATA_JSON)) {
    const { a: [sname, elem, target], b: nums, c: descs } = row;
    const [rank, cost] = nums.slice(0, 2);
    const card = descs[2];

    if (!skillElems.includes(elem)) {
      console.log(elem)
    }

    skillData[sname] = {
      elem,
      rank,
      target: card === '-' ? 'Self' : card,
      cost: cost ? cost + (cost > 1000 ? COST_MP : COST_HP) : 0,
      effect: skillRowToEffect(nums, descs),
    }
  }

  for (const dataJson of [VAN_DEMON_DATA_JSON, OVE_DEMON_DATA_JSON]) {
    for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
      if (dataJson[name]) {
        dataJson[name]['prereq'] = prereq
      }
    }
  }

  for (const game of ['ds1', 'dso']) {
    compConfigs[game] = {
      appTitle: 'Devil Survivor',
      appCssClasses: ['kuzu', 'ds1'],

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
      skillData: [skillData],
      normalTable: FUSION_CHART_JSON,
      elementTable: ELEMENT_CHART_JSON,
      mitamaTable: MITAMA_TABLE,
      specialRecipes: SPECIAL_RECIPES_JSON,
      isDesu: true
    }
  }

  compConfigs.dso.appTitle = 'Devil Survivor Overclocked';
  compConfigs.dso.demonData = [VAN_DEMON_DATA_JSON, OVE_DEMON_DATA_JSON];
  compConfigs.dso.skillData = [skillData];

  return {
    appTitle: 'Devil Survivor',
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
