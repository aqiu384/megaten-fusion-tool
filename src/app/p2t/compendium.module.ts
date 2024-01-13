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
import MUTATIONS_JSON from './data/mutations.json';

type NumDict = { [name: string]: number };

function createCompConfig(): CompendiumConfig {
  const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const elemOrder = skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {});
  const demons: { [name: string]: Demon } = {};
  const enemies: { [name: string]: Demon } = {};
  const skills: { [name: string]: Skill } = {};
  const resistCodes: NumDict = {};

  for (const [res, code] of Object.entries(COMP_CONFIG_JSON.resistCodes)) {
    resistCodes[res] = ((code / 1000 | 0 + 8) << 10) + (code % 1000 / 2.5 | 0);
  }

  for (const [name, json] of Object.entries(DEMON_DATA_JSON)) {
    const resists = json.resists.split('').map(r => resistCodes[r]);
    demons[name] = {
      race:       json.race,
      lvl:        json.lvl,
      currLvl:    json.lvl,
      name,
      price:      0,
      inherits:   elemOrder[json['subtype'] || 'alm'],
      atks:       ([json['cards'] || 0]).concat(json.atks),
      stats:      json.stats,
      resists,
      presists:   [],
      mresists:   resists,
      growth:     json.growth,
      fusion:     json['cards'] ? 'normal' : 'accident',
      skills:     json.skills.reduce((acc, s, i) => { if (s.length > 1) { acc[s] = COMP_CONFIG_JSON.learnRanks[i]; } return acc; }, {}),
      drop:       json.drop,
      isEnemy:    false,
      party:      (json['party'] || PARTY_AFFINITY_JSON.table[json.race]).split('').map(p => resistCodes[p]),
      affinities: (json['inherits'] || 'oooo').split('').map(i => i === 'o'),
      trait:      json.traits.join(', '),
      transfers:  {},
      area:       '-'
    };
  }

  for (const [name, json] of Object.entries(ENEMY_DATA_JSON)) {
    const nameD = name + (DEMON_DATA_JSON[name] ? ' D' : '');
    const resists = json.resists.split('').map(r => resistCodes[r]);
    enemies[nameD] = {
      race:       json.race,
      lvl:        json.lvl,
      currLvl:    json.lvl,
      name:       nameD,
      price:      0,
      inherits:   elemOrder[json['subtype'] || 'alm'],
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
      party:      [],
      affinities: [],
      trait:      json.traits.join(', '),
      transfers:  {},
      area:       '-'
    };
  }

  const COST_VARIES = 17 << 10;
  const COST_FUSION = 18 << 10;

  for (const [name, json] of Object.entries(SKILL_DATA_JSON)) {
    skills[name] = {
      name,
      element: json.element,
      cost:    json['cost'] ? COST_FUSION : COST_VARIES,
      rank:    (json['restrict'] ? 95 : 0) + (json['cost'] - 1951 || 0) + (json['power'] / 100 || 0),
      effect:  json['power'] ? json['power'] + ' dmg' + (json['effect'] ? ', ' + json['effect'] : '') : json['effect'],
      target:  json['target'] || 'Self',
      level:   0,
      card:    json['card'] || '',
      learnedBy: [],
      transfer: []
    };
  }

  return {
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
    mutations:       MUTATIONS_JSON,

    demons,
    enemies,
    skills,

    raceOrder: COMP_CONFIG_JSON.races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    elemOrder,
  };
}

const SMT_COMP_CONFIG = createCompConfig();

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
    [{ provide: COMPENDIUM_CONFIG, useValue: SMT_COMP_CONFIG }]
  ]
})
export class CompendiumModule { }
