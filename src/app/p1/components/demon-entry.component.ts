import { Component, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { FusionChart, FusionEntry, MultiFusionPair } from '../../compendium/models';
import { CurrentDemonService } from '../../compendium/current-demon.service';
import { splitWithGem } from '../../compendium/fusions/per-nonelem-fissions';

import { Demon, CompendiumConfig } from '../models';
import { Compendium } from '../models/compendium';
import { FusionDataService } from '../fusion-data.service';

import { DemonStatsComponent } from '../../compendium/components/demon-stats.component';
import { FusionEntryTableComponent } from '../../compendium/components/fusion-entry-table.component';
import { DemonInheritsComponent } from '../../compendium/components/demon-inherits.component';
import { DemonResistsComponent } from '../../compendium/components/demon-resists.component';
import { DemonSkillsComponent } from '../../compendium/components/demon-skills.component';
import { FusionMultiPairTableComponent } from '../../compendium/components/fusion-multi-pair-table.component';
import { P1FissionTableComponent } from './p1-fission-table.component';
import { DemonMissingComponent } from '../../compendium/components/demon-missing.component';
import { EnemyEntryComponent } from './enemy-entry.component';

@Component({
  selector: 'app-demon-entry',
  imports: [
    DemonStatsComponent, FusionEntryTableComponent,
    DemonInheritsComponent, DemonResistsComponent, DemonSkillsComponent,
    FusionMultiPairTableComponent, P1FissionTableComponent,
    DemonMissingComponent
  ],
  template: `
    @if (demon) {
      <app-demon-stats
        [title]="'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name"
        [statHeaders]="compConfig.baseAtks"
        [stats]="demon.atks"
        [inherits]="demon.inherits"
        [fusionHeaders]="['Traits', 'Returns']">
        <td>{{ demon.trait }}</td>
        <td>{{ demon.drop }}</td>
      </app-demon-stats>
      @if (demon.prereq) {
        <table class="entry-table">
          <thead><tr><th class="title">Special Fusion Condition</th></tr></thead>
          <tbody><tr><td>{{ demon.prereq }}</td></tr></tbody>
        </table>
      }
      @if (mutatesFrom.length) {
        <app-fusion-entry-table
          [title]="'Mutates From'"
          [baseUrl]="'..'"
          [rowData]="mutatesFrom"
          [inGameCurrencySymbol]="compendium.inGameCurrencySymbol">
        </app-fusion-entry-table>
      }
      @if (mutatesTo.length) {
        <app-fusion-entry-table
          [title]="'Mutates To'"
          [baseUrl]="'..'"
          [rowData]="mutatesTo"
          [inGameCurrencySymbol]="compendium.inGameCurrencySymbol">
        </app-fusion-entry-table>
      }
      <table class="entry-table">
        <thead>
          <tr>
            <th [attr.colSpan]="compConfig.baseStats.length + 1" class="title">Stat Growths</th>
          </tr>
          <tr>
            <th>Rank</th>
            @for (stat of compConfig.baseStats; track $index) { <th>{{ stat }}</th> }
          </tr>
        </thead>
        <tbody>
          @for (row of statGrowths; track $index; let rank = $index) {
            <tr>
              <td>{{ rank + 1 }}</td>
              @for (growth of row; track $index) { <td>{{ growth }}</td> }
            </tr>
          }
        </tbody>
      </table>
      <app-demon-inherits
        [lang]="'en'"
        [hasLvls]="true"
        [hasIcons]="false"
        [inheritHeaders]="compConfig.affinityUsers"
        [inherits]="demon.affinities">
      </app-demon-inherits>
      @if (compConfig.presistElems.length) {
        <app-demon-resists
          [resistHeaders]="compConfig.presistElems"
          [resists]="demon.presists">
        </app-demon-resists>
      }
      <app-demon-resists
        [resistHeaders]="compConfig.mresistElems"
        [resists]="demon.mresists">
      </app-demon-resists>
      @if (compConfig.inheritElems.length) {
        <app-demon-inherits
          [inheritHeaders]="compConfig.inheritElems"
          [inherits]="demon.elemAffins">
        </app-demon-inherits>
      }
      <app-demon-skills
        [elemOrder]="compConfig.elemOrder"
        [hasTarget]="true"
        [compendium]="compendium"
        [skillLevels]="demon.skills">
      </app-demon-skills>
      @if (elemRecipes.length) {
        <app-fusion-multi-pair-table
          [resultName]="name"
          [leftHeader]="'Recipe'"
          [rightHeader]="'Gem'"
          [rowData]="elemRecipes">
        </app-fusion-multi-pair-table>
      }
      @if (compConfig.appCssClasses[0] === 'p1') {
        <app-p1-fission-table>
        </app-p1-fission-table>
      }
    }
    @if (!demon) {
      <app-demon-missing [name]="name">
      </app-demon-missing>
    }
  `
})
export class DemonEntryComponent implements OnChanges {
  @Input() name: string;
  @Input() demon: Demon;
  @Input() elemRecipes: MultiFusionPair[];
  @Input() compendium: Compendium;
  @Input() compConfig: CompendiumConfig;

  statGrowths: number[][];
  mutatesTo: FusionEntry[];
  mutatesFrom: FusionEntry[];

  ngOnChanges() {
    const statGrowths = [this.demon.stats];

    for (const row of this.compendium.getStatGrowths(this.demon.growth)) {
      statGrowths.push(statGrowths[statGrowths.length - 1].map((s, i) => s + row[i]));
    }

    this.statGrowths = statGrowths;
    this.mutatesTo = this.compendium.reverseLookupSpecial(this.demon.name)
      .map(n => this.compendium.getDemon(n))
      .map(d => ({ price: d.atks[0], race1: d.race, lvl1: d.lvl, name1: d.name }));
    this.mutatesFrom = this.compendium.getSpecialNameEntries(this.demon.name)
      .map(n => this.compendium.getDemon(n))
      .map(d => ({ price: d.atks[0], race1: d.race, lvl1: d.lvl, name1: d.name }));
  }
}

@Component({
  selector: 'app-demon-entry-container',
  imports: [DemonEntryComponent, EnemyEntryComponent],
  template: `
    @if (!demon || !demon.isEnemy) {
      <app-demon-entry
        [name]="name"
        [demon]="demon"
        [elemRecipes]="elemRecipes"
        [compConfig]="compConfig"
        [compendium]="compendium">
      </app-demon-entry>
    }
    @if (demon && demon.isEnemy) {
      <app-enemy-entry
        [name]="name"
        [demon]="demon"
        [compConfig]="compConfig"
        [compendium]="compendium">
      </app-enemy-entry>
    }
  `
})
export class DemonEntryContainerComponent {
  protected subscriptions: Subscription[] = [];
  name: string;
  demon: Demon;
  compendium: Compendium;
  fusionChart: FusionChart;
  compConfig: CompendiumConfig;
  elemRecipes: MultiFusionPair[];
  appName = 'Test App';

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private changeDetectorRef: ChangeDetectorRef,
    private currentDemonService: CurrentDemonService,
    private fusionDataService: FusionDataService
  ) {
    this.appName = fusionDataService.appName;
    this.compConfig = fusionDataService.compConfig;
  }

  ngOnInit() {
    this.subscribeAll();
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  subscribeAll() {
    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(comp => {
        this.compendium = comp;
        this.getDemonEntry();
      }));

    this.subscriptions.push(
      this.fusionDataService.fusionChart.subscribe(fusionChart => {
        this.fusionChart = fusionChart;
        this.getDemonEntry();
      }));

    this.subscriptions.push(
      this.currentDemonService.currentDemon.subscribe(name => {
        this.name = name;
        this.getDemonEntry();
      }));

    this.route.params.subscribe(params => {
      this.currentDemonService.nextCurrentDemon(params['demonName']);
    });
  }

  getDemonEntry() {
    if (this.compendium && this.name) {
      this.title.setTitle(`${this.name} - ${this.appName}`);
      this.demon = this.compendium.getDemon(this.name);
      this.elemRecipes = this.compConfig.hasFusion && this.demon ? splitWithGem(this.name, this.compendium, this.fusionChart) : [];
      this.changeDetectorRef.markForCheck();
    }
  }
}
