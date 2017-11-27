import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { DemonEntryContainerComponent as DECC } from '../../compendium/containers/demon-entry.component';
import { BaseStats, ResistElements, ElementOrder } from '../../desu/constants';
import { Demon } from '../../desu/models';
import { DesuCompendium as Compendium } from '../../desu/models/compendium';

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
        [resistHeaders]="resistHeaders"
        [resists]="demon.resists">
      </app-demon-resists>
      <app-demon-skills
        [title]="'Command Skills'"
        [hasRank]="true"
        [elemOrder]="elemOrder"
        [compendium]="compendium"
        [skillLevels]="demon.command">
      </app-demon-skills>
      <app-demon-skills
        [title]="'Passive Skills'"
        [hasRank]="true"
        [elemOrder]="elemOrder"
        [compendium]="compendium"
        [skillLevels]="demon.passive">
      </app-demon-skills>
      <table *ngIf="demon.racial">
        <thead>
          <tr><th colspan="3">Racial Skill</th></tr>
          <tr><th>Name</th><th>Effect</th><th>Lvl</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ demon.racial.skill }}</td>
            <td>{{ demon.racial.effect }}</td>
            <td>Innate</td>
          </tr>
          <tr *ngIf="demon.racial.enskill">
            <td>{{ demon.racial.enskill }}</td>
            <td>{{ demon.racial.eneffect }}</td>
            <td>{{ demon.raceup | skillLevelToString }}</td>
          </tr>
        </tbody>
      </table>
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
  resistHeaders = ResistElements;
  elemOrder = ElementOrder;
}

@Component({
  selector: 'app-demon-entry-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-entry [name]="name" [demon]="demon" [compendium]="compendium"></app-demon-entry>
  `
})
export class DemonEntryContainerComponent extends DECC {
  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private currentDemonService: CurrentDemonService,
    private fusionDataService: FusionDataService
  ) {
    super(route, title, currentDemonService, fusionDataService);
    this.appName = fusionDataService.appName;
  }
}
