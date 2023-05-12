import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { Compendium } from '../models/compendium';
import { Demon } from '../models';
import {
  BaseStats,
  PartyMembers,
  PhysResistanceElements,
  MagicResistanceElements,
  SkillElementOrder,
  InheritElements
} from '../constants';

import { CurrentDemonService } from '../../compendium/current-demon.service';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-demon-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="demon">
      <h2>Lvl {{ demon.lvl }} {{ demon.race }} {{ demon.name }}</h2>
      <table class="entry-table">
        <thead>
          <tr>
            <th colspan="5" class="title">Stats</th>
          </tr>
          <tr>
            <th>SP Cost</th>
            <th>Growth Type</th>
            <th>Type</th>
            <th>Subtype</th>
            <th>Returns</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ demon.atks[0] }}</td>
            <td>{{ demon.growth }}</td>
            <td>{{ demon.type }}</td>
            <td>{{ demon.subtype }}</td>
            <td>{{ demon.drop }}</td>
          </tr>
        </tbody>
      </table>
      <table class="entry-table">
        <thead>
          <tr>
            <th [attr.colSpan]="statHeaders.length" class="title">Stat Growths</th>
          </tr>
          <tr>
            <th *ngFor="let stat of statHeaders">{{ stat }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of statGrowths; let rank = index">
            <td>{{ rank + 1 }}</td>
            <td *ngFor="let growth of row">{{ growth }}</td>
          </tr>
        </tbody>
      </table>
      <table class="entry-table">
        <thead>
          <tr>
            <th [attr.colSpan]="affinityHeaders.length" class="title">
              Party Affinities
            </th>
          </tr>
          <tr>
            <th *ngFor="let aff of affinityHeaders">{{ aff }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td *ngFor="let aff of demon.affinity.split('')">{{ affinityLookup[aff] }}</td>
          </tr>
        </tbody>
      </table>
      <app-demon-resists
        [resistHeaders]="pResistanceHeaders"
        [resists]="demon.presists">
      </app-demon-resists>
      <app-demon-resists
        [resistHeaders]="mResistanceHeaders"
        [resists]="demon.mresists">
      </app-demon-resists>
      <app-demon-inherits
        [inheritHeaders]="inheritHeaders"
        [inherits]="compendium.getInheritElems(demon.inherits)">
      </app-demon-inherits>
      <app-demon-skills
        [elemOrder]="elemOrder"
        [hasTarget]="true"
        [compendium]="compendium"
        [skillLevels]="demon.skills">
      </app-demon-skills>
      <app-mib-fission-table>
      </app-mib-fission-table>
    </ng-container>
    <app-demon-missing *ngIf="!demon" [name]="name">
    </app-demon-missing>
  `
})
export class DemonEntryComponent implements OnChanges {
  @Input() name: string;
  @Input() demon: Demon;
  @Input() compendium: Compendium;

  statGrowths: number[][];
  statHeaders = ['Rank'].concat(BaseStats).concat(['MAtk', 'MDef']);
  affinityHeaders = PartyMembers;
  affinityLookup = { 'e': 'Best', 'o': 'Good', 'a': 'Bad', 'w': 'Worst' };
  pResistanceHeaders = PhysResistanceElements;
  mResistanceHeaders = MagicResistanceElements;
  inheritHeaders = InheritElements;
  elemOrder = SkillElementOrder;

  ngOnChanges() {
    const initStats = this.demon.stats.concat(this.demon.atks.slice(1));
    const statDeltas = this.compendium.getStatGrowths(this.demon.growth);
    const statTotals = [initStats];

    for (const row of statDeltas) {
      statTotals.push(statTotals[statTotals.length - 1].map((s, i) => s + row[i]));
    }

    this.statGrowths = statTotals;
  }
}

@Component({
  selector: 'app-demon-entry-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-entry *ngIf="!demon || !demon.isEnemy"
      [name]="name"
      [demon]="demon"
      [compendium]="compendium">
    </app-demon-entry>
    <app-enemy-entry *ngIf="demon && demon.isEnemy"
      [name]="name"
      [demon]="demon"
      [compendium]="compendium">
    </app-enemy-entry>
  `
})
export class DemonEntryContainerComponent {
  protected subscriptions: Subscription[] = [];
  name: string;
  demon: Demon;
  compendium: Compendium;
  appName = 'Test App';

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private currentDemonService: CurrentDemonService,
    private fusionDataService: FusionDataService
  ) {
    this.appName = fusionDataService.appName;
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
    }
  }
}
