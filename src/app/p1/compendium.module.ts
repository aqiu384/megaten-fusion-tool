import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from './compendium-routing.module';
import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { P1CompendiumModule } from './p1-compendium.module';
import { Demon, Skill, CompendiumConfig } from './models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';
import ENEMY_DATA_JSON from './data/enemy-data.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import GROWTH_TYPES_JSON from './data/growth-types.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import PARTY_AFFINITY_JSON from './data/party-affinity.json';

function getEnumOrder(target: string[]): { [key: string]: number } {
  return target.reduce((acc, s, i) => { acc[s] = i; return acc; }, {});
}

function summarizeResists(presists: number[], mresists: number[]): number[] {
  return [
    presists.slice(0, 7).reduce((acc, r) => acc + r, 0) / 7,
    presists[7],
    presists.slice(8, 11).reduce((acc, r) => acc + r, 0) / 3,
    presists[11],
    presists[12],
    presists[13],
    mresists[0],
    mresists[1],
    mresists[2],
    mresists[3],
    mresists.slice(4, 8).reduce((acc, r) => acc + r, 0) / 4,
    (mresists[8] + mresists[9]) / 2,
    (mresists[10] + mresists[11]) / 2,
    mresists[12]
  ];
}

const resistCodes = COMP_CONFIG_JSON.resistCodes;
const skillElems = COMP_CONFIG_JSON.presistElems.concat(COMP_CONFIG_JSON.mresistElems, COMP_CONFIG_JSON.skillElems);
const elemOrder = getEnumOrder(skillElems);

for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
  FUSION_PREREQS_JSON[name] = `Requires ${prereq} totem`;
}

function loadDemons(): { [name: string]: Demon } {
  const demons: { [name: string]: Demon } = {};
  for (const [name, json] of Object.entries(DEMON_DATA_JSON)) {
    const presists = json.presists.split('').map(r => resistCodes[r]);
    const mresists = json.mresists.split('').map(r => resistCodes[r]);
    demons[name] = {
      race:       json.race,
      lvl:        json.lvl,
      currLvl:    json.lvl,
      name,
      price:      0,
      inherits:   elemOrder[json.subtype],
      atks:       json.atks.slice(0, 1),
      stats:      json.stats.concat(json.atks.slice(1)),
      resists:    summarizeResists(presists, mresists),
      presists,
      mresists,
      growth:     json.growth,
      fusion:     'normal',
      skills:     json.skills.reduce((acc, s, i) => { if (s.length > 1) { acc[s] = COMP_CONFIG_JSON.learnRanks[i]; } return acc; }, {}),
      drop:       json.drop,
      isEnemy:    false,
      party:      (json['party'] || PARTY_AFFINITY_JSON.table[json.race]).split('').map(p => resistCodes[p]),
      affinities: (json['inherits'] || 'ooooooooo').split('').map(i => i === 'o'),
      trait:      '-',
      transfers:  {},
      area:       '-'
    };
  }
  return demons;
}

function loadEnemies(): { [name: string]: Demon } {
  const enemies: { [name: string]: Demon } = {};
  for (const [name, json] of Object.entries(ENEMY_DATA_JSON)) {
    const presists = json.presists.split('').map(r => resistCodes[r]);
    const mresists = json.mresists.split('').map(r => resistCodes[r]);
    enemies[name] = {
      race:       json.race,
      lvl:        json.lvl,
      currLvl:    json.lvl,
      name,
      price:      Math.pow(json.lvl, 2),
      inherits:   elemOrder[json.subtype],
      atks:       json.stats.slice(2).concat(json.atks),
      stats:      json.stats.slice(0, 2),
      resists:    summarizeResists(presists, mresists),
      presists,
      mresists,
      growth:     'pixie',
      fusion:     'normal',
      skills:     (json['skills'] || []).reduce((acc, s, i) => { acc[s] = 0; return acc; }, {}),
      drop:       json.drop,
      isEnemy:    true,
      party:      [],
      affinities: [],
      trait:      json.traits.join(', '),
      transfers:  (json['transfers'] || []).reduce((acc, s, i) => { acc[s] = i + 1; return acc; }, {}),
      area:       json.areas.length > 0 ? json.areas[0] : '-'
    };
  }
  return enemies;
}

function loadSkills(): { [name: string]: Skill } {
  const skills: { [name: string]: Skill } = {};
  for (const [name, json] of Object.entries(SKILL_DATA_JSON)) {
    skills[name] = {
      name,
      element: json.element,
      cost:    json['cost'] + 1000 || 0,
      rank:    (json['cost'] || 0) + (json['power'] / 100 || 0),
      effect:  json['power'] ? json['power'] + ' dmg' + (json['effect'] ? ', ' + json['effect'] : '') : json['effect'],
      target:  json.target.toString(),
      level:   0,
      card:    json['card'] || '',
      learnedBy: [],
      transfer: []
    };
  }
  return skills;
}

const compendiumConfig: CompendiumConfig = {
  appTitle: 'Megami Ibunroku Persona',
  appCssClasses: ['p1', 'mib'],

  races:           COMP_CONFIG_JSON.races,
  resistElems:     COMP_CONFIG_JSON.resistElems,
  presistElems:    COMP_CONFIG_JSON.presistElems,
  mresistElems:    COMP_CONFIG_JSON.mresistElems,
  resistCodes:     COMP_CONFIG_JSON.resistCodes,
  skillElems,
  inheritElems:    COMP_CONFIG_JSON.inheritElems,
  baseStats:       COMP_CONFIG_JSON.baseStats,
  baseAtks:        COMP_CONFIG_JSON.baseAtks,
  enemyStats:      COMP_CONFIG_JSON.enemyStats,
  party:           PARTY_AFFINITY_JSON.party,
  fusionPrereqs:   FUSION_PREREQS_JSON,
  specialRecipes:  SPECIAL_RECIPES_JSON,
  growthTypes:     GROWTH_TYPES_JSON,
  mutations:       {},

  demons:    loadDemons(),
  enemies:   loadEnemies(),
  skills:    loadSkills(),

  raceOrder: getEnumOrder(COMP_CONFIG_JSON.races),
  elemOrder,
};

@NgModule({
  imports: [
    CommonModule,
    P1CompendiumModule,
    CompendiumRoutingModule
  ],
  providers: [
    Title,
    FusionDataService,
    [{ provide: FUSION_DATA_SERVICE, useExisting: FusionDataService }],
    [{ provide: COMPENDIUM_CONFIG, useValue: compendiumConfig }]
  ]
})
export class CompendiumModule { }
