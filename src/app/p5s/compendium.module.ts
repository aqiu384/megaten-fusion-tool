import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from './compendium-routing.module';
import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { CompendiumConfig } from './models';

import { SharedModule } from '../shared/shared.module';
import { SharedCompendiumModule } from '../compendium/compendium.module';

import { CompendiumComponent } from './components/compendium.component';
import { DemonListContainerComponent } from './components/demon-list.component';
import { SkillListContainerComponent } from './components/skill-list.component';

import { DemonEntryComponent, DemonEntryContainerComponent } from './components/demon-entry.component';
import { P5SFusionChartComponent, FusionChartContainerComponent } from './components/fusion-chart.component';
import { P5SFissionTableComponent } from './components/p5s-fission-table.component';
import { P5SFusionTableComponent } from './components/p5s-fusion-table.component';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import PARTY_DATA_JSON from './data/party-data.json';
import PAIR_RECIPES_JSON from './data/pair-recipes.json';
import DOWN_RECIPES_JSON from './data/down-recipes.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import INHERIT_TYPES_JSON from '../p5/data/inheritance-types.json';

function createCompConfig(): CompendiumConfig {
  const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const affinityTypes: { [elem: string]: number[] } = {};
  const races = [];

  for(const race of COMP_CONFIG_JSON['races']) {
    races.push(race);
    races.push(race + ' P');
  }

  for (let [i, ratio] of INHERIT_TYPES_JSON.ratios.entries()) {
    affinityTypes[INHERIT_TYPES_JSON.inherits[i]] = ratio.split('').map(x => x === 'o' ? 10 : -10);
  }

  for (const entry of Object.values(PARTY_DATA_JSON)) {
    entry.race = entry.race + ' P';
    entry['fusion'] = 'party';
  }

  for (const json of [DEMON_DATA_JSON, PARTY_DATA_JSON]) {
    for (const entry of Object.values(json)) {
      entry['affinities'] = affinityTypes[entry['inherits']].slice();
    }
  }

  const COST_HP = 2 << 10;
  const COST_MP = 3 << 10;

  for (const entry of Object.values(SKILL_DATA_JSON)) {
    const cost = entry['cost'];
    const costType = cost > 1000 ? COST_MP - 1000 : COST_HP;
    entry['cost'] = cost ? cost + costType: 0;

    if (entry['rank'] < 21) {
      entry['transfer'] = COMP_CONFIG_JSON.skillCardRanks[entry['rank'] - 1];
    }
  }

  for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
    DEMON_DATA_JSON[name]['prereq'] = prereq;
    DEMON_DATA_JSON[name]['fusion'] = 'enemy';
  }

  return {
    appTitle: 'Persona 5 Strikers',
    appCssClasses: ['p5'],

    races,
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    baseStats: COMP_CONFIG_JSON.baseStats,
    skillElems,
    resistElems: COMP_CONFIG_JSON.resistElems,
    affinityElems: INHERIT_TYPES_JSON.elems,
    resistCodes: COMP_CONFIG_JSON.resistCodes,
    elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),

    demonData: [DEMON_DATA_JSON, PARTY_DATA_JSON],
    skillData: [SKILL_DATA_JSON],
    specialRecipes: SPECIAL_RECIPES_JSON,
    pairRecipes: PAIR_RECIPES_JSON,
    downRecipes: DOWN_RECIPES_JSON
  };
}

const SMT_COMP_CONFIG = createCompConfig();

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
    P5SFissionTableComponent,
    P5SFusionTableComponent,
    P5SFusionChartComponent,
    FusionChartContainerComponent
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
