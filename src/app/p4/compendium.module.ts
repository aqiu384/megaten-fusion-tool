import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { SharedModule } from '../shared/shared.module';
import { SharedCompendiumModule } from '../compendium/compendium.module';
import { CompendiumRoutingModule } from './compendium-routing.module';

import { CompendiumComponent } from './components/compendium.component';
import { DemonListContainerComponent } from './components/demon-list.component';
import { SkillListContainerComponent } from './components/skill-list.component';

import { DemonEntryComponent, DemonEntryContainerComponent } from './components/demon-entry.component';
import { EnemyEntryComponent } from './components/enemy-entry.component';

import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { CompendiumConfig } from './models';

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

function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
const inheritTypes: { [elem: string]: number[] } = {};
const races = [];

for(const race of COMP_CONFIG_JSON['races']) {
  races.push(race);
  races.push(race + ' P');
}

for (let i = 0; i < INHERIT_TYPES_JSON.inherits.length; i++) {
  inheritTypes[INHERIT_TYPES_JSON.inherits[i]] = INHERIT_TYPES_JSON.ratios[i];
}

for (const [demon, entry] of Object.entries(PARTY_DATA_JSON)) {
  entry.race = entry.race + ' P';
  entry['fusion'] = 'party';
  DEMON_DATA_JSON[demon] = entry;
}

export const P4_COMPENDIUM_CONFIG: CompendiumConfig = {
  appTitle: 'Persona 4',
  gameTitles: { p4: 'Persona 4', p4g: 'Persona 4 Golden' },
  appCssClasses: ['p4'],

  races,
  raceOrder: getEnumOrder(races),
  baseStats: COMP_CONFIG_JSON.baseStats,
  skillElems,
  resistElems: COMP_CONFIG_JSON.resistElems,
  resistCodes: COMP_CONFIG_JSON.resistCodes,
  elemOrder: getEnumOrder(skillElems),
  inheritTypes,
  inheritElems: INHERIT_TYPES_JSON.elems,

  enemyStats: ['HP', 'MP'],
  enemyResists: COMP_CONFIG_JSON.resistElems.concat(['almighty']),

  demonData: { p4: [DEMON_DATA_JSON], p4g: [DEMON_DATA_JSON, GOLDEN_DEMON_DATA_JSON] },
  skillData: { p4: [SKILL_DATA_JSON, GOLDEN_SKILL_DATA_JSON], p4g: [SKILL_DATA_JSON, GOLDEN_SKILL_DATA_JSON] },
  enemyData: { p4: [ENEMY_DATA_JSON], p4g: [ENEMY_DATA_JSON, GOLDEN_ENEMY_DATA_JSON] },

  normalTable: { p4: FUSION_CHART_JSON, p4g: GOLDEN_FUSION_CHART_JSON },
  specialRecipes: { p4: SPECIAL_RECIPES_JSON, p4g: SPECIAL_RECIPES_JSON },
  hasSkillCards: { p4: false, p4g: true }
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedCompendiumModule,
    CompendiumRoutingModule
  ],
  declarations: [
    CompendiumComponent,
    DemonListContainerComponent,
    SkillListContainerComponent,
    DemonEntryComponent,
    DemonEntryContainerComponent,
    EnemyEntryComponent
  ],
  providers: [
    Title,
    FusionDataService,
    [{ provide: FUSION_DATA_SERVICE, useExisting: FusionDataService }],
    [{ provide: FUSION_TRIO_SERVICE, useExisting: FusionDataService }],
    [{ provide: COMPENDIUM_CONFIG, useValue: P4_COMPENDIUM_CONFIG }]
  ]
})
export class CompendiumModule { }
