import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../pq2/compendium-routing.module';
import { FusionDataService } from '../pq2/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { PQCompendiumModule } from '../pq2/pq-compendium.module';
import { CompendiumConfig, CompendiumConfigSet } from '../pq2/models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import VAN_DEMON_DATA_JSON from './data/van-demon-data.json';
import FES_DEMON_DATA_JSON from './data/fes-demon-data.json';
import ANS_DEMON_DATA_JSON from './data/ans-demon-data.json';
import P3P_DEMON_DATA_JSON from './data/p3p-demon-data.json';

import VAN_ENEMY_DATA_JSON from './data/van-enemy-data.json';
import ANS_ENEMY_DATA_JSON from './data/ans-enemy-data.json';

import VAN_FUSION_CHART_JSON from './data/van-fusion-chart.json';
import FES_FUSION_CHART_JSON from './data/fes-fusion-chart.json';

import VAN_SKILL_DATA_JSON from './data/van-skill-data.json';
import FES_SKILL_DATA_JSON from './data/fes-skill-data.json';
import ANS_SKILL_DATA_JSON from './data/ans-skill-data.json';
import P3P_SKILL_DATA_JSON from './data/p3p-skill-data.json';

import VAN_SPECIAL_RECIPES_JSON from './data/van-special-recipes.json';
import FES_SPECIAL_RECIPES_JSON from './data/fes-special-recipes.json';
import PAIR_SPECIAL_RECIPES_JSON from './data/pair-special-recipes.json';

import VAN_DEMON_UNLOCKS_JSON from './data/van-demon-unlocks.json';
import FES_DEMON_UNLOCKS_JSON from './data/fes-demon-unlocks.json';

import INHERIT_TYPES_JSON from './data/inheritance-types.json';
import FES_PARTY_DATA_JSON from './data/fes-party-data.json';
import P3P_PARTY_DATA_JSON from './data/p3p-party-data.json';
import { importSkillRow } from '../pq2/models/skill-importer';

function createCompConfig(): CompendiumConfigSet {
  const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const costTypes = [2 << 10, (5 << 10) - 1000, (4 << 10) - 2000];
  const inheritTypes: { [elem: string]: number[] } = {};
  const races = [];
  const skillDatas = [];
  const compConfigs: { [game: string]: CompendiumConfig } = {};

  for(const race of COMP_CONFIG_JSON['races']) {
    races.push(race);
    races.push(race + ' P');
  }

  for (let [i, ratio] of INHERIT_TYPES_JSON.ratios.entries()) {
    inheritTypes[INHERIT_TYPES_JSON.inherits[i]] = ratio;
  }

  for (const skills of [VAN_SKILL_DATA_JSON, FES_SKILL_DATA_JSON, ANS_SKILL_DATA_JSON, P3P_SKILL_DATA_JSON]) {
    const skillData = {};
    skillDatas.push(skillData);

    for (const row of Object.values(skills)) {
      const sname = row.a[0];
      row.b[0] = row.b[0] || 99;
      skillData[sname] = importSkillRow(row, costTypes);
      skillData[sname].element = skillData[sname].elem;
    }
  }

  const gameDataSets = [
    [VAN_DEMON_DATA_JSON, {}],
    [FES_DEMON_DATA_JSON, FES_PARTY_DATA_JSON],
    [ANS_DEMON_DATA_JSON, {}],
    [P3P_DEMON_DATA_JSON, P3P_PARTY_DATA_JSON]
  ]

  for (const [demons, parties] of gameDataSets) {
    Object.assign(demons, parties);

    for (const demon of Object.values(demons)) {
      demon['code'] = 1;
    }

    for (const demon of Object.values(parties)) {
      demon['race'] += ' P';
      demon['fusion'] = 'party';
    }
  }

  for (const enemies of [VAN_ENEMY_DATA_JSON, ANS_ENEMY_DATA_JSON]) {
    for (const [name, enemy] of Object.entries(enemies)) {
      enemy['stats'] = enemy['stats'].slice(0, 2);
      enemy['drops'] = enemy['gem'] ? [enemy['gem']] : [];
    }
  }

  for (const [demon, recipe] of Object.entries(PAIR_SPECIAL_RECIPES_JSON)) {
    VAN_SPECIAL_RECIPES_JSON[demon] = recipe;
  }

  for (const [demon, recipe] of Object.entries(VAN_SPECIAL_RECIPES_JSON)) {
    if (!FES_SPECIAL_RECIPES_JSON[demon]) {
      FES_SPECIAL_RECIPES_JSON[demon] = recipe;
    }
  }

  for (const game of ['p3', 'p3f', 'p3a', 'p3p']) {
    compConfigs[game] = {
      appTitle: 'Persona 3',
      lang: 'en',
      races,
      raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
      appCssClasses: ['p3'],

      skillData: skillDatas.slice(0, 1),
      skillElems,
      ailmentElems: COMP_CONFIG_JSON.ailments.map(x => x.slice(0, 3)),
      elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
      resistCodes: COMP_CONFIG_JSON.resistCodes,

      demonData: [VAN_DEMON_DATA_JSON],
      baseStats: COMP_CONFIG_JSON.baseStats,
      resistElems: COMP_CONFIG_JSON.resistElems,
      inheritTypes,
      inheritElems: INHERIT_TYPES_JSON.elems,

      demonUnlocks: FES_DEMON_UNLOCKS_JSON,
      enemyData: [VAN_ENEMY_DATA_JSON],
      enemyStats: ['HP', 'MP'],

      normalTable: FES_FUSION_CHART_JSON,
      elementTable: { elems: [], races: [], table: [] },
      specialRecipes: FES_SPECIAL_RECIPES_JSON,
      maxSkillSlots: 8,
      hasTripleFusion: true,
      hasDemonResists: true,
      hasSkillRanks: true,
      hasEnemies: true,
      hasQrcodes: false,
      hasSkillCards: false,
      hasManualInheritance: false,
      computePrice: (b, d) => 2000 + 3 * b.stats.reduce((acc, x) => acc + x, 0) ** 2,

      defaultDemon: 'Pixie',
      settingsKey: 'p3-fusion-tool-settings',
      settingsVersion: 2401131500
    };
  }

  compConfigs.p3.normalTable = VAN_FUSION_CHART_JSON;
  compConfigs.p3.specialRecipes = VAN_SPECIAL_RECIPES_JSON;
  compConfigs.p3.demonUnlocks = VAN_DEMON_UNLOCKS_JSON;

  compConfigs.p3f.appTitle = 'Persona 3 FES';
  compConfigs.p3f.settingsKey = 'p3f-fusion-tool-settings';
  compConfigs.p3f.demonData = [VAN_DEMON_DATA_JSON, FES_DEMON_DATA_JSON];
  compConfigs.p3f.skillData = skillDatas.slice(0, 2);

  compConfigs.p3a.appTitle = 'Persona 3 FES: The Answer';
  compConfigs.p3a.settingsKey = 'p3a-fusion-tool-settings';
  compConfigs.p3a.demonData = [VAN_DEMON_DATA_JSON, FES_DEMON_DATA_JSON, ANS_DEMON_DATA_JSON];
  compConfigs.p3a.skillData = skillDatas.slice(0, 3);
  compConfigs.p3a.enemyData = [ANS_ENEMY_DATA_JSON];
  compConfigs.p3a.specialRecipes = PAIR_SPECIAL_RECIPES_JSON;
  compConfigs.p3a.demonUnlocks = [{
    category: 'Unused',
    unlocked: false,
    conditions: { 'Orpheus Telos': 'Unused' }
  }];

  compConfigs.p3p.appTitle = 'Persona 3 Portable';
  compConfigs.p3p.settingsKey = 'p3p-fusion-tool-settings';
  compConfigs.p3p.demonData = [VAN_DEMON_DATA_JSON, FES_DEMON_DATA_JSON, P3P_DEMON_DATA_JSON];
  compConfigs.p3p.skillData = [skillDatas[0], skillDatas[1], skillDatas[3]];
  compConfigs.p3p.hasSkillCards = true;

  return {
    appTitle: 'Persona 3',
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    configs: compConfigs
  };
}

const SMT_COMP_CONFIG = createCompConfig();

@NgModule({
  imports: [
    CommonModule,
    PQCompendiumModule,
    CompendiumRoutingModule
  ],
  providers: [
    Title,
    FusionDataService,
    [{ provide: FUSION_DATA_SERVICE, useExisting: FusionDataService }],
    [{ provide: FUSION_TRIO_SERVICE, useExisting: FusionDataService }],
    [{ provide: COMPENDIUM_CONFIG, useValue: SMT_COMP_CONFIG }]
  ]
})
export class CompendiumModule { }
