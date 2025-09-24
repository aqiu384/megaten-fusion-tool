import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../pq2/compendium-routing.module';
import { FusionDataService } from '../pq2/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { PQCompendiumModule } from '../pq2/pq-compendium.module';
import { CompendiumConfig, CompendiumConfigSet } from '../pq2/models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import GOLDEN_DEMON_DATA_JSON from './data/golden-demon-data.json';
import ENEMY_DATA_JSON from './data/enemy-data.json';
import GOLDEN_ENEMY_DATA_JSON from './data/golden-enemy-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import GOLDEN_SKILL_DATA_JSON from './data/golden-skill-data.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import GOLDEN_FUSION_CHART_JSON from './data/golden-fusion-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import INHERIT_TYPES_JSON from './data/inheritance-types.json';
import PARTY_DATA_JSON from './data/party-data.json';
import GOLDEN_PARTY_DATA_JSON from './data/golden-party-data.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';
import GOLDEN_DEMON_UNLOCKS_JSON from './data/golden-demon-unlocks.json';
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

  for (const skills of [SKILL_DATA_JSON, GOLDEN_SKILL_DATA_JSON]) {
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
    [DEMON_DATA_JSON, PARTY_DATA_JSON],
    [GOLDEN_DEMON_DATA_JSON, GOLDEN_PARTY_DATA_JSON]
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

  for (const enemies of [ENEMY_DATA_JSON, GOLDEN_ENEMY_DATA_JSON]) {
    for (const [name, enemy] of Object.entries(enemies)) {
      enemy['stats'] = enemy['stats'].slice(0, 2);
      enemy['drops'] = [enemy['material'] || '-', enemy['gem'] || '-'].filter(m => m !== '-');
    }
  }

  for (const game of ['p4', 'p4g']) {
    compConfigs[game] = {
      appTitle: 'Persona 4',
      lang: 'en',
      races,
      raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
      appCssClasses: ['p4'],

      skillData: skillDatas.slice(0, 1),
      skillElems,
      ailmentElems: COMP_CONFIG_JSON.ailments.map(x => x.slice(0, 3)),
      elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
      resistCodes: COMP_CONFIG_JSON.resistCodes,

      demonData: [DEMON_DATA_JSON],
      baseStats: COMP_CONFIG_JSON.baseStats,
      resistElems: COMP_CONFIG_JSON.resistElems,
      inheritTypes,
      inheritElems: INHERIT_TYPES_JSON.elems,

      demonUnlocks: DEMON_UNLOCKS_JSON,
      enemyData: [ENEMY_DATA_JSON],
      enemyStats: ['HP', 'MP'],

      normalTable: FUSION_CHART_JSON,
      elementTable: { elems: [], races: [], table: [] },
      specialRecipes: SPECIAL_RECIPES_JSON,
      maxSkillSlots: 8,
      hasTripleFusion: true,
      hasDemonResists: true,
      hasSkillRanks: true,
      hasEnemies: true,
      hasQrcodes: false,
      hasSkillCards: false,
      hasManualInheritance: false,
      computePrice: (b, d) => 2000 + b.stats.reduce((acc, x) => acc + x, 0) ** 2,

      defaultDemon: 'Pixie',
      settingsKey: 'p4-fusion-tool-settings',
      settingsVersion: 2401131500
    };
  }

  compConfigs.p4g.appTitle = 'Persona 4 Golden';
  compConfigs.p4g.settingsKey = 'p4g-fusion-tool-settings';
  compConfigs.p4g.demonData = [DEMON_DATA_JSON, GOLDEN_DEMON_DATA_JSON];
  compConfigs.p4g.enemyData = [ENEMY_DATA_JSON, GOLDEN_ENEMY_DATA_JSON];
  compConfigs.p4g.demonUnlocks = GOLDEN_DEMON_UNLOCKS_JSON;
  compConfigs.p4g.skillData = skillDatas;
  compConfigs.p4g.normalTable = GOLDEN_FUSION_CHART_JSON;
  compConfigs.p4g.hasSkillCards = true;
  compConfigs.p4g.hasManualInheritance = true;

  return  {
    appTitle: 'Persona 4',
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
