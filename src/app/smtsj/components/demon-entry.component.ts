import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { BaseStats, ResistanceElements, InheritElements, Ailments, SkillElementOrder } from '../models/constants';
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
        [title]="'Lvl ' + demon.lvl + ' ' + demon.align + ' ' + demon.race + ' ' + demon.name"
        [price]="demon.price"
        [statHeaders]="statHeaders"
        [fusionHeaders]="fusionHeaders"
        [stats]="demon.stats">
        <td>{{ demon.attack }}</td>
      </app-demon-stats>
      <app-demon-resists
        [resistHeaders]="resistanceHeaders"
        [resists]="demon.resists"
        [ailmentHeaders]="ailmentHeaders"
        [ailments]="demon.ailments">
      </app-demon-resists>
      <app-demon-inherits
        [inheritHeaders]="inheritanceHeaders"
        [inherits]="demon.affinities">
      </app-demon-inherits>
      <app-demon-skills
        [hasRank]="true"
        [hasTarget]="true"
        [hasInherit]="true"
        [hasLvl]="false"
        [elemOrder]="elemOrder"
        [compendium]="compendium"
        [skillLevels]="demon.skills">
      </app-demon-skills>
      <app-demon-skills
        [title]="'D-Source Skills'"
        [hasRank]="true"
        [hasTarget]="true"
        [hasInherit]="true"
        [hasLvl]="false"
        [elemOrder]="elemOrder"
        [compendium]="compendium"
        [skillLevels]="demon.source">
      </app-demon-skills>
      <app-smt-fusions [showFusionAlert]="laplaceOn">
        Laplace Subapp Enabled (Result Lvl +4)
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
  @Input() laplaceOn = false;

  statHeaders = BaseStats;
  fusionHeaders = [ 'Normal Attack', ];
  resistanceHeaders = ResistanceElements;
  elemOrder = SkillElementOrder;
  inheritanceHeaders = InheritElements;
  ailmentHeaders = Ailments;
}

@Component({
  selector: 'app-demon-entry-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-entry
      [name]="name"
      [demon]="demon"
      [compendium]="compendium"
      [laplaceOn]="laplaceOn">
    </app-demon-entry>
  `
})
export class DemonEntryContainerComponent {
  protected subscriptions: Subscription[] = [];
  name: string;
  demon: Demon;
  compendium: Compendium;
  appName = 'Test App';
  laplaceOn = false;

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

    this.subscriptions.push(
      this.fusionDataService.fusionChart.subscribe(chart => {
        this.laplaceOn = chart.isSubappOn('Laplace');
      }));
  }

  getDemonEntry() {
    if (this.compendium && this.name) {
      this.title.setTitle(`${this.name} - ${this.appName}`);
      this.demon = this.compendium.getDemon(this.name);
    }
  }
}
