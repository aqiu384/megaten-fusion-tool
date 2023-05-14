import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../p1/compendium-routing.module';
import { FusionDataService } from '../p1/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { P1CompendiumModule } from '../p1/p1-compendium.module';
import { Demon, Skill, CompendiumConfig } from '../p1/models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import ENEMY_DATA_JSON from './data/enemy-data.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import GROWTH_TYPES_JSON from './data/growth-types.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import PARTY_AFFINITY_JSON from './data/party-affinities.json';

function getEnumOrder(target: string[]): { [key: string]: number } {
  return target.reduce((acc, s, i) => { acc[s] = i; return acc; }, {});
}

const resistCodes = COMP_CONFIG_JSON.resistCodes;
const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
const elemOrder = getEnumOrder(skillElems);

for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
  FUSION_PREREQS_JSON[name] = `Requires ${prereq} material card`;
}

function loadDemons(): { [name: string]: Demon } {
  const demons: { [name: string]: Demon } = {};
  for (const [name, json] of Object.entries(DEMON_DATA_JSON)) {
    const resists = json.resists.split('').map(r => resistCodes[r]);
    demons[name] = {
      race:       json.race,
      lvl:        json.lvl,
      currLvl:    json.lvl,
      name,
      price:      0,
      inherits:   elemOrder[json['subtype'] || 'alm'],
      atks:       json.atks,
      stats:      json.stats,
      resists,
      presists:   [],
      mresists:   resists,
      growth:     json.growth,
      fusion:     'normal',
      skills:     json.skills.reduce((acc, s, i) => { if (s.length > 1) { acc[s] = COMP_CONFIG_JSON.learnRanks[i]; } return acc; }, {}),
      drop:       json.drop,
      isEnemy:    false,
      party:      (json['party'] || PARTY_AFFINITY_JSON.table[json.race]).split('').map(p => resistCodes[p]),
      affinities: (json['inherits'] || 'oooo').split('').map(i => i === 'o'),
      trait:      json.traits.join(', '),
      transfers:  {},
      area:       'None'
    };
  }
  return demons;
}

function loadEnemies(): { [name: string]: Demon } {
  const enemies: { [name: string]: Demon } = {};
  for (const [name, json] of Object.entries(ENEMY_DATA_JSON)) {
    const nameD = name + (DEMON_DATA_JSON[name] ? ' D' : '');
    const resists = json.resists.split('').map(r => resistCodes[r]);
    enemies[nameD] = {
      race:       json.race,
      lvl:        json.lvl,
      currLvl:    json.lvl,
      name:       nameD,
      price:      0,
      inherits:   elemOrder['alm'],
      atks:       json.atks,
      stats:      json.atks.slice(0, 1),
      estats:     json.stats,
      resists,
      presists:   [],
      mresists:   resists,
      growth:     'pixie',
      fusion:     'normal',
      skills:     json.skills.reduce((acc, s) => { acc[s] = 0; return acc; }, {}),
      drop:       json.drop,
      isEnemy:    true,
      party:      (json['party'] || '------').split('').map(p => resistCodes[p]),
      affinities: [1, 1, 1, 1],
      trait:      json.traits.join(', '),
      transfers:  {},
      area:       '-'
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
      cost:    0,
      rank:    json['power'] / 10 || 0,
      effect:  json['power'] ? json['power'] + ' dmg' + (json['effect'] ? ', ' + json['effect'] : '') : json['effect'],
      target:  json['target'] || 'Self',
      level:   0,
      card:    json['card'] || '',
      learnedBy: [],
      transfer: []
    };
  }
  return skills;
}

const compendiumConfig: CompendiumConfig = {
  appTitle: 'Persona 2: Innocent Sin',
  appCssClasses: ['p2t', 'p2', 'mib'],

  races:           COMP_CONFIG_JSON.races,
  resistElems:     COMP_CONFIG_JSON.resistElems,
  presistElems:    [],
  mresistElems:    COMP_CONFIG_JSON.resistElems,
  resistCodes:     COMP_CONFIG_JSON.resistCodes,
  skillElems,
  inheritElems:    COMP_CONFIG_JSON.inheritElems,
  baseStats:       COMP_CONFIG_JSON.baseStats,
  baseAtks:        COMP_CONFIG_JSON.baseAtks,
  enemyStats:      COMP_CONFIG_JSON.enemyStats,
  party:           PARTY_AFFINITY_JSON.party,
  fusionPrereqs:   FUSION_PREREQS_JSON,
  specialRecipes:  {},
  growthTypes:     GROWTH_TYPES_JSON,

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
