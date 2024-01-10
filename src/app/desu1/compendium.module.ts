import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumConfig, CompendiumConfigSet } from '../krch/models';
import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../compendium/constants';

import COMP_CONFIG_JSON from './data/comp-config.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';

import VAN_DEMON_DATA_JSON from './data/van-demon-data.json';
import VAN_SKILL_DATA_JSON from './data/van-skill-data.json';
import OVE_DEMON_DATA_JSON from './data/ove-demon-data.json';
import OVE_SKILL_DATA_JSON from './data/ove-skill-data.json';
import RACIAL_SKILLS_JSON from './data/racial-skills.json';

import { FusionDataService } from '../krch/fusion-data.service';
import { SmtKuzuCompendiumModule } from '../krch/smt-kuzu-compendium.module';
import { CompendiumRoutingModule } from '../krch/compendium-routing.module';

function createCompConfig(): CompendiumConfigSet {
  const rskillLookup = {}
  const races = COMP_CONFIG_JSON.races;
  const resistElems = COMP_CONFIG_JSON.resistElems;
  const skillElems = resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const compConfigs: { [game: string]: CompendiumConfig } = {};
  const MITAMA_TABLE = [
    ['Nigi', 'Ara ', 'Kusi'],
    ['Kusi', 'Ara '],
    ['Saki'],
    []
  ];

  const COST_HP = 2 << 24;
  const COST_MP = 3 << 24;

  for (const dataJson of [VAN_SKILL_DATA_JSON, OVE_SKILL_DATA_JSON]) {
    for (const entry of Object.values(dataJson)) {
      const cost = entry['cost']
      const costType = cost > 1000 ? COST_MP - 1000 : COST_HP;
      entry['cost'] = cost ? cost + costType : 0;
      entry['elem'] = entry.element;
      entry['rank'] = entry['rank'] || (entry['elem'] === 'auto' ? 1 : 99);
    }
  }

  for (const [race, entry] of Object.entries(RACIAL_SKILLS_JSON)) {
    if (races.includes(race)) {
      rskillLookup[race] = entry['skill'];
      VAN_SKILL_DATA_JSON[entry['skill']] = {
        elem: 'racial',
        effect: entry.effect
      };
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
      skillData: [VAN_SKILL_DATA_JSON],
      normalTable: FUSION_CHART_JSON,
      elementTable: ELEMENT_CHART_JSON,
      mitamaTable: MITAMA_TABLE,
      specialRecipes: SPECIAL_RECIPES_JSON,
      isDesu: true
    }
  }

  compConfigs.dso.appTitle = 'Devil Survivor Overclocked';
  compConfigs.dso.demonData = [VAN_DEMON_DATA_JSON, OVE_DEMON_DATA_JSON];
  compConfigs.dso.skillData = [VAN_SKILL_DATA_JSON, OVE_SKILL_DATA_JSON];

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
