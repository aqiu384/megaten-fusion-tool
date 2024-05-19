import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../pq2/compendium-routing.module';
import { FusionDataService } from '../pq2/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { PQCompendiumModule } from '../pq2/pq-compendium.module';
import { CompendiumConfig } from '../pq2/models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import ENEMY_DATA_JSON from './data/enemy-data.json';
import FUSION_CHART_JSON from '../pq/data/fusion-chart.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import PARTY_DATA_JSON from './data/party-data.json';
import DEMON_CODES_JSON from './data/demon-codes.json';
import SKILL_CODES_JSON from './data/skill-codes.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';

function skillRowToString(row: (string | number)[]): string {
  const [power, minHits, maxHits, accuracy, mod, effect, cond] = row.slice(5);
  const baseMod = parseInt(mod.toString());
  const powerStr = power === 0 ? '' : `${power} pwr`;
  const hitStr = minHits !== maxHits ? `${minHits}-${maxHits} hits` : maxHits === 0 ? '' : `${maxHits} hits`;
  const modStr = baseMod === 0 ? '' : baseMod < 1000 ? `${mod}%` : baseMod < 2000 ? `x${(baseMod - 1000) / 100}` : baseMod < 3000 ? `+${baseMod - 2000}%` : `+${baseMod - 3000}`;
  const effectStr = `${modStr} ${effect === '-' ? '' : effect} ${cond === '-' ? '' : cond}`.trim();
  const fullStr = [powerStr, hitStr, effectStr].filter(s => s !== '').join(', ');
  return fullStr.substring(0, 1) === 'x' ? fullStr : fullStr.substring(0, 1).toUpperCase() + fullStr.substring(1);
}

function createCompConfig(): CompendiumConfig {
  const resistElems = COMP_CONFIG_JSON.resistElems;
  const skillElems = resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const races = [];
  const skillData = {};
  const inheritTypes: { [elem: string]: number } = {};

  for (const race of COMP_CONFIG_JSON.races) {
    races.push(race);
    races.push(race + ' P');
  }

  for (const [demon, entry] of Object.entries(PARTY_DATA_JSON)) {
    entry.race = entry.race + ' P';
    entry.stats = entry.stats.slice(0, 2);
    entry['lvl'] = 1;
    entry['fusion'] = 'party';
    entry['inherit'] = 'almpp';
    DEMON_DATA_JSON[demon] = entry;
  }

  for (const [code, name] of Object.entries(DEMON_CODES_JSON)) {
    DEMON_DATA_JSON[name]['code'] = parseInt(code, 10);
  }

  const COST_HP = 1 << 10;
  const COST_MP = (3 << 10) - 1000;
  const COST_CC = (15 << 10) - 2000;

  for (const row of Object.values(SKILL_DATA_JSON)) {
    const [sname, elem, target, rank, baseCost, power, minHits, maxHits, accuracy, mod, effect, cond] = row;
    const cost = parseInt(baseCost.toString())
    skillData[sname] = {
      elem,
      target: target === '-' ? 'Self' : target,
      cost: cost ? cost + (cost > 1000 ? (cost > 2000 ? COST_CC : COST_MP) : COST_HP) : 0,
      effect: skillRowToString(row)
    }
  }

  for (const [code, name] of Object.entries(SKILL_CODES_JSON)) {
    skillData[name]['code'] = parseInt(code, 10);
  }

  for (const demon of Object.values(DEMON_DATA_JSON)) {
    demon.stats = demon.stats.map(s => Math.floor(s / 10));
  }

  for (const enemy of Object.values(ENEMY_DATA_JSON)) {
    const stats = enemy['stats'];
    enemy['stats'] = [stats[0], stats[1] * 3, stats[3] * 3];
    enemy['drops'] = Object.keys(enemy['dodds']);
    enemy['resists'] = enemy['resists'].slice(0, 9);
  }

  for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
    DEMON_DATA_JSON[name]['prereq'] = prereq;
  }

  for (const [elem, inherits] of Object.entries(COMP_CONFIG_JSON.inheritTypes)) {
    inheritTypes[elem] = parseInt(inherits, 2);
  }

  return {
    appTitle: 'Persona Q: Shadow of the Labyrinth',
    races,
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    appCssClasses: ['pq1'],

    skillData,
    skillElems,
    ailmentElems: COMP_CONFIG_JSON.ailments,
    elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    resistCodes: COMP_CONFIG_JSON.resistCodes,

    demonData: DEMON_DATA_JSON,
    baseStats: ['HP', 'MP'],
    resistElems,
    inheritTypes,
    inheritElems: COMP_CONFIG_JSON.inheritElems,

    demonUnlocks: DEMON_UNLOCKS_JSON,
    enemyData: ENEMY_DATA_JSON,
    enemyStats: ['HP', 'Atk', 'Def'],

    normalTable: FUSION_CHART_JSON,
    hasTripleFusion: true,
    hasDemonResists: false,
    hasSkillRanks: false,
    hasEnemies: true,
    hasQrcodes: true,
    specialRecipes: SPECIAL_RECIPES_JSON,

    settingsKey: 'pq-fusion-tool-settings',
    settingsVersion: 2405151000,

    defaultDemon: 'Pixie'
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
    [{ provide: COMPENDIUM_CONFIG, useValue: SMT_COMP_CONFIG }],
  ]
})
export class CompendiumModule { }
