import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { DemonEntryContainerComponent as DECC } from '../../compendium/containers/demon-entry.component';
import { BaseStats, ResistanceElements, ElementOrder, APP_TITLE } from '../constants';
import { Demon } from '../models';
import { Compendium } from '../models/compendium';
import { FusionChart } from '../models/fusion-chart';

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
        [fusionHeaders]="fusionHeaders"
        [stats]="demon.stats"
        [inherit]="demon.inherit">
        <td>{{ demon.person }}</td>
      </app-demon-stats>
      <table>
        <thead><tr><th *ngFor="let atk of atkHeaders">{{ atk }}</th></tr></thead>
        <tbody><tr><td *ngFor="let atk of demon.atks">{{ atk }}</td></tr></tbody>
      </table>
      <app-demon-resists
        [resistHeaders]="resistHeaders"
        [resists]="demon.resists">
      </app-demon-resists>
      <app-demon-skills
        [hasLvl]="false"
        [elemOrder]="elemOrder"
        [compendium]="compendium"
        [skillLevels]="demon.skills">
      </app-demon-skills>
      <app-demon-skills
        [title]="'Inheritable Skills'"
        [hasLvl]="false"
        [compendium]="compendium"
        [skillLevels]="compendium.getInheritSkills(demon.inherit)">
      </app-demon-skills>
      <app-smt-fusions
        [hasTripleFusion]="true"
        [excludedDlc]="demon.fusion === 'excluded'">
      </app-smt-fusions>
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
  atkHeaders = [ 'Cost Point', 'MAG Summon', 'P.ATK', 'P.HIT', 'M.ATK', 'M.HIT', 'B.DEF', 'AVD' ];
  fusionHeaders = [ 'Personality' ];
  elemOrder = ElementOrder;
  resistHeaders = ResistanceElements;
}

@Component({
  selector: 'app-demon-entry-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-entry
      [name]="name"
      [demon]="demon"
      [compendium]="compendium">
    </app-demon-entry>
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
