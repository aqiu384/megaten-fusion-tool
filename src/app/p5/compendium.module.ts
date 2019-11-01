import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { SharedModule } from '../shared/shared.module';
import { SharedCompendiumModule } from '../compendium/compendium.module';
import { CompendiumRoutingModule } from './compendium-routing.module';

import { DemonListContainerComponent } from './components/demon-list.component';
import { SkillListContainerComponent } from './components/skill-list.component';
import { DemonEntryComponent, DemonEntryContainerComponent } from './components/demon-entry.component';
import { EnemyEntryComponent } from './components/enemy-entry.component';

import { FusionChartContainerComponent } from './components/fusion-chart.component';
import { DemonDlcSettingsContainerComponent } from './components/demon-dlc-settings.component';

import { CompendiumComponent } from './components/compendium.component';

import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { CompendiumConfig } from './models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import INHERIT_TYPES_JSON from './data/inheritance-types.json';

import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import ENEMY_DATA_JSON from './data/enemy-data.json';
import TRAIT_DATA_JSON from './data/jap-traits.json';
import SUBBOSS_DATA_JSON from './data/subboss-data.json';

import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';

import ROYAL_DEMONS_JSON from './data/royal-demon-data.json';
import ROYAL_SPECIALS_JSON from './data/royal-special-recipes.json';

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

for(const race of COMP_CONFIG_JSON.races) {
  races.push(race);
  races.push(race + ' P');
}

for (let i = 0; i < INHERIT_TYPES_JSON.inherits.length; i++) {
  inheritTypes[INHERIT_TYPES_JSON.inherits[i]] = INHERIT_TYPES_JSON.ratios[i].split('').map(x => x === 'O' ? 100 : 0);
}

export const P5_COMPENDIUM_CONFIG: CompendiumConfig = {
  appTitle: 'Persona 5',
  gameTitles: { p5: 'Persona 5', p5r: 'Persona 5 Royal' },
  appCssClasses: ['p5'],

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
  enemyResists: COMP_CONFIG_JSON.resistElems,

  demonData: { p5: [DEMON_DATA_JSON], p5r: [DEMON_DATA_JSON, ROYAL_DEMONS_JSON] },
  skillData: { p5: [SKILL_DATA_JSON], p5r: [SKILL_DATA_JSON] },
  enemyData: { p5: [ENEMY_DATA_JSON, SUBBOSS_DATA_JSON], p5r: [ENEMY_DATA_JSON, SUBBOSS_DATA_JSON] },
  traitData: TRAIT_DATA_JSON,

  normalTable: { p5: FUSION_CHART_JSON, p5r: FUSION_CHART_JSON },
  elementTable: { p5: ELEMENT_CHART_JSON, p5r: ELEMENT_CHART_JSON },
  specialRecipes: { p5: SPECIAL_RECIPES_JSON, p5r: Object.assign(ROYAL_SPECIALS_JSON, SPECIAL_RECIPES_JSON) },
  hasSkillCards: { p5: false, p5r: true },

  dlcDemons: { p5: COMP_CONFIG_JSON.dlcDemons, p5r: COMP_CONFIG_JSON.dlcDemons.concat(COMP_CONFIG_JSON.royalDlcDemons) },
  settingsKey: { p5: 'p5-fusion-tool-settings', p5r: 'p5r-fusion-tool-settings' },
  settingsVersion: 1709211400
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
    DemonEntryComponent,
    DemonEntryContainerComponent,
    EnemyEntryComponent,
    DemonListContainerComponent,
    SkillListContainerComponent,
    DemonDlcSettingsContainerComponent,
    FusionChartContainerComponent
  ],
  providers: [
    Title,
    FusionDataService,
    [{ provide: FUSION_DATA_SERVICE, useExisting: FusionDataService }],
    [{ provide: COMPENDIUM_CONFIG, useValue: P5_COMPENDIUM_CONFIG }]
  ]
})
export class CompendiumModule { }
