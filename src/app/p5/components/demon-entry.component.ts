import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { CompendiumConfig } from '../models';
import { Demon } from '../models';
import { Compendium } from '../models/compendium';

import { CurrentDemonService } from '../../compendium/current-demon.service';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-demon-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="demon">
      <app-demon-stats
        [title]="'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name"
        [price]="demon.price"
        [statHeaders]="compConfig.baseStats"
        [stats]="demon.stats"
        [fusionHeaders]="['Electric Chair']"
        [inherits]="demon.inherits">
        <td>{{ demon.item }}</td>
      </app-demon-stats>
      <app-demon-resists
        [resistHeaders]="compConfig.resistElems"
        [resists]="demon.resists">
      </app-demon-resists>
      <app-demon-inherits
        [inheritHeaders]="compConfig.inheritElems"
        [inherits]="compendium.getInheritElems(demon.inherits)">
      </app-demon-inherits>
      <app-demon-skills
        [elemOrder]="compConfig.elemOrder"
        [compendium]="compendium"
        [skillLevels]="demon.skills">
      </app-demon-skills>
      <ng-container *ngIf="compendium.splitMultiFusion(name) as rows">
        <table *ngIf="rows.length" class="entry-table">
          <thead>
            <tr><th colspan=5 class="title">Ingredient 1 x Treasure Demon 2 = {{ demon.name }}</th></tr>
            <tr><th rowspan=2>Price</th><th colspan=3>Ingredient 1</th><th>Treasure Demon 2</th></tr>
            <tr><th>Names</th><th>MinLvl</th><th>MaxLvl</th><th>Names</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of rows">
              <td>{{ row.price }}</td>
              <td>
                <ul class="comma-list">
                  <li *ngFor="let name of row.names1"><a routerLink="../{{ name }}">{{ name }} </a></li>
                </ul>
              </td>
              <td>{{ row.lvl1 }}</td>
              <td>{{ row.lvl2 }}</td>
              <td>
                <ul class="comma-list">
                  <li *ngFor="let name of row.names2"><a routerLink="../{{ name }}">{{ name }} </a></li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </ng-container>
      <app-smt-fusions [excludedDlc]="demon.fusion === 'excluded'">
      </app-smt-fusions>
    </ng-container>
    <app-demon-missing *ngIf="!demon" [name]="name">
    </app-demon-missing>
  `
})
export class DemonEntryComponent {
  @Input() name: string;
  @Input() demon: Demon;
  @Input() compendium: Compendium;
  @Input() compConfig: CompendiumConfig;
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
