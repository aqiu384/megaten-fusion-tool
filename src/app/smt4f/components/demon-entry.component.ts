import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { DemonEntryContainerComponent as DECC } from '../../compendium/containers/demon-entry.component';
import { BaseStats, ResistanceElements, AffinityElements, ElementOrder } from '../../smt4/models/constants';
import { Ailments, APP_TITLE } from '../models/constants';
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
        [statHeaders]="statHeaders"
        [stats]="demon.stats">
      </app-demon-stats>
      <app-demon-resists
        [resistHeaders]="resistanceHeaders"
        [resists]="demon.resists"
        [ailmentHeaders]="ailmentHeaders"
        [ailments]="demon.ailments">
      </app-demon-resists>
      <app-demon-inherits
        [hasLvls]="true"
        [inheritHeaders]="affinityHeaders"
        [inherits]="demon.affinities">
      </app-demon-inherits>
      <app-demon-skills
        [hasTarget]="true"
        [hasRank]="true"
        [elemOrder]="elemOrder"
        [compendium]="compendium"
        [skillLevels]="demon.skills">
      </app-demon-skills>
      <app-fusion-entry-table *ngIf="demon.evolvesFrom"
        [title]="'Evolves From'"
        [baseUrl]="'..'"
        [rowData]="[demon.evolvesFrom]">
      </app-fusion-entry-table>
      <app-fusion-entry-table *ngIf="demon.evolvesTo"
        [title]="'Evolves To'"
        [baseUrl]="'..'"
        [rowData]="[demon.evolvesTo]">
      </app-fusion-entry-table>
      <app-smt-fusions></app-smt-fusions>
    </ng-container>
    <ng-container *ngIf="!demon">
      <table>
        <thead>
          <tr><th>Entry for {{ name }}</th></tr>
        </thead>
        <tbody>
          <tr><td>Error: Could not find entry in compendium for {{ name }}</td></tr>
        </tbody>
      </table>
    </ng-container>
  `
})
export class DemonEntryComponent {
  @Input() name: string;
  @Input() demon: Demon;
  @Input() compendium: Compendium;

  statHeaders = BaseStats;
  resistanceHeaders = ResistanceElements;
  elemOrder = ElementOrder;
  ailmentHeaders = Ailments;
  affinityHeaders = AffinityElements;
}

@Component({
  selector: 'app-demon-entry-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-entry [name]="name" [demon]="demon" [compendium]="compendium"></app-demon-entry>
  `
})
export class DemonEntryContainerComponent extends DECC {
  appName = APP_TITLE;

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private currentDemonService: CurrentDemonService,
    private fusionDataService: FusionDataService
  ) {
    super(route, title, currentDemonService, fusionDataService);
  }
}
