import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from './compendium-routing.module';
import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { P4CompendiumModule } from './p4-compendium.module';
import { CompendiumConfig, CompendiumConfigSet } from './models';

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
import { importSkillRow } from '../pq2/models/skill-importer';

function createCompConfig(): CompendiumConfigSet {
  const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const costTypes = [2 << 10, (5 << 10) - 1000, (4 << 10) - 2000];
  const affinityTypes: { [elem: string]: number[] } = {};
  const races = [];
  const skillDatas = [];
  const compConfigs: { [game: string]: CompendiumConfig } = {};

  for(const race of COMP_CONFIG_JSON['races']) {
    races.push(race);
    races.push(race + ' P');
  }

  for (let [i, ratio] of INHERIT_TYPES_JSON.ratios.entries()) {
    affinityTypes[INHERIT_TYPES_JSON.inherits[i]] = ratio.map(x => x > 1 ? x : 0);
  }

  for (const entry of Object.values(PARTY_DATA_JSON)) {
    entry.race = entry.race + ' P';
    entry['fusion'] = 'party';
  }

  for (const entry of Object.values(GOLDEN_PARTY_DATA_JSON)) {
    entry.race = entry.race + ' P';
    entry['fusion'] = 'party';
  }

  for (const json of [DEMON_DATA_JSON, GOLDEN_DEMON_DATA_JSON, PARTY_DATA_JSON, GOLDEN_PARTY_DATA_JSON]) {
    for (const entry of Object.values(json)) {
      entry['affinities'] = affinityTypes[entry['inherits']].slice();
    }
  }

  for (const skills of [SKILL_DATA_JSON, GOLDEN_SKILL_DATA_JSON]) {
    const skillData = {};
    skillDatas.push(skillData);

    for (const row of Object.values(skills)) {
      const sname = row.a[0];
      skillData[sname] = importSkillRow(row, costTypes);
      skillData[sname].element = skillData[sname].elem;
    }
  }

  for (const game of ['p4', 'p4g']) {
    compConfigs[game] = {
      appTitle: 'Persona 4',
      appCssClasses: ['p4'],

      races,
      raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
      baseStats: COMP_CONFIG_JSON.baseStats,
      skillElems,
      resistElems: COMP_CONFIG_JSON.resistElems,
      ailmentElems: COMP_CONFIG_JSON.ailments.map(x => x.slice(0, 3)),
      affinityElems: INHERIT_TYPES_JSON.elems,
      resistCodes: COMP_CONFIG_JSON.resistCodes,
      elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),

      enemyStats: ['HP', 'MP'],
      enemyResists: COMP_CONFIG_JSON.resistElems,

      demonData: [DEMON_DATA_JSON, PARTY_DATA_JSON],
      skillData: skillDatas.slice(0, 1),
      enemyData: [ENEMY_DATA_JSON],

      normalTable: FUSION_CHART_JSON,
      specialRecipes: SPECIAL_RECIPES_JSON,
      hasSkillCards: false,
      hasManualInheritance: false
    }
  }

  compConfigs.p4g.appTitle = 'Persona 4 Golden';
  compConfigs.p4g.demonData = [DEMON_DATA_JSON, GOLDEN_DEMON_DATA_JSON, GOLDEN_PARTY_DATA_JSON];
  compConfigs.p4g.enemyData = [ENEMY_DATA_JSON, GOLDEN_ENEMY_DATA_JSON];
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
    P4CompendiumModule,
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
