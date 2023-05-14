import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { Compendium } from '../models/compendium';
import { Demon, CompendiumConfig } from '../models';
import { CurrentDemonService } from '../../compendium/current-demon.service';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-demon-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="demon">
      <app-demon-stats
        [title]="'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name"
        [statHeaders]="['SP Cost']"
        [stats]="demon.atks.slice(0, 1)"
        [fusionHeaders]="['Returns']"
        [inherits]="demon.inherits">
        <td>{{ demon.drop }}</td>
      </app-demon-stats>
      <table class="entry-table">
        <thead>
          <tr>
            <th [attr.colSpan]="compConfig.baseStats.length + 1" class="title">Stat Growths</th>
          </tr>
          <tr>
            <th>Rank</th>
            <th *ngFor="let stat of compConfig.baseStats">{{ stat }}</th>
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
          <tr><th [attr.colSpan]="compConfig.party.length" class="title">Party Affinities</th></tr>
          <tr><th *ngFor="let member of compConfig.party">{{ member }}</th></tr>
        </thead>
        <tbody>
          <tr><td *ngFor="let affine of partyAffines;">{{ affine }}</td></tr>
        </tbody>
      </table>
      <app-demon-resists *ngIf="compConfig.presistElems.length"
        [resistHeaders]="compConfig.presistElems"
        [resists]="demon.presists">
      </app-demon-resists>
      <app-demon-resists
        [resistHeaders]="compConfig.mresistElems"
        [resists]="demon.mresists">
      </app-demon-resists>
      <app-demon-inherits
        [inheritHeaders]="compConfig.inheritElems"
        [inherits]="demon.affinities">
      </app-demon-inherits>
      <app-demon-skills
        [elemOrder]="compConfig.elemOrder"
        [hasTarget]="true"
        [compendium]="compendium"
        [skillLevels]="demon.skills">
      </app-demon-skills>
      <app-p1-fission-table *ngIf="compConfig.appCssClasses[0] === 'p1'">
      </app-p1-fission-table>
    </ng-container>
    <app-demon-missing *ngIf="!demon" [name]="name">
    </app-demon-missing>
  `
})
export class DemonEntryComponent implements OnChanges {
  @Input() name: string;
  @Input() demon: Demon;
  @Input() compendium: Compendium;
  @Input() compConfig: CompendiumConfig;

  statGrowths: number[][];
  partyAffines: string[];
  affinityLookup = { 0: 'Great', 50: 'Good', 100: 'Norm', 1150: 'Bad', 1200: 'Worst' };

  ngOnChanges() {
    const statGrowths = [this.demon.stats];

    for (const row of this.compendium.getStatGrowths(this.demon.growth)) {
      statGrowths.push(statGrowths[statGrowths.length - 1].map((s, i) => s + row[i]));
    }

    this.statGrowths = statGrowths;
    this.partyAffines = this.demon.party.map(p => this.affinityLookup[p]);
  }
}

@Component({
  selector: 'app-demon-entry-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-entry *ngIf="!demon || !demon.isEnemy"
      [name]="name"
      [demon]="demon"
      [compConfig]="compConfig"
      [compendium]="compendium">
    </app-demon-entry>
    <app-enemy-entry *ngIf="demon && demon.isEnemy"
      [name]="name"
      [demon]="demon"
      [compConfig]="compConfig"
      [compendium]="compendium">
    </app-enemy-entry>
  `
})
export class DemonEntryContainerComponent {
  protected subscriptions: Subscription[] = [];
  name: string;
  demon: Demon;
  compendium: Compendium;
  compConfig: CompendiumConfig;
  appName = 'Test App';

  constructor(
    private route: ActivatedRoute,
    private title: Title,
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
