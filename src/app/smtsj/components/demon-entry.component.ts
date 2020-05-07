import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { DemonEntryContainerComponent as DECC } from '../../compendium/containers/demon-entry.component';
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
        <td *ngIf="!demon.attack">Physical 1x to single foe</td>
        <td *ngIf="demon.attack as attack">
          {{ attack.element ? attack.element : 'Physical' }}
          x{{ attack.hits ? attack.hits : '1' }}
          to {{ attack.target ? attack.target : 'single foe' }}
          {{ attack.ailment ? '- ' + attack.ailment : '' }}
        </td>
      </app-demon-stats>
      <app-demon-resists
        [resistHeaders]="resistanceHeaders"
        [resists]="demon.resists"
        [ailmentHeaders]="ailmentHeaders"
        [ailments]="demon.ailments">
      </app-demon-resists>
      <app-demon-inherits
        [inheritHeaders]="inheritanceHeaders"
        [inherits]="demon.inherits">
      </app-demon-inherits>
      <app-demon-skills
        [hasRank]="true"
        [hasInherit]="true"
        [hasLvl]="false"
        [elemOrder]="elemOrder"
        [compendium]="compendium"
        [skillLevels]="demon.skills">
      </app-demon-skills>
      <app-demon-skills
        [title]="'D-Source Skills'"
        [hasRank]="true"
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
export class DemonEntryContainerComponent extends DECC {
  laplaceOn = false;

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private currentDemonService: CurrentDemonService,
    private fusionDataService: FusionDataService
  ) {
    super(route, title, currentDemonService, fusionDataService);
    this.appName = fusionDataService.appName;
  }

  subscribeAll() {
    super.subscribeAll();

    this.subscriptions.push(
      this.fusionDataService.fusionChart.subscribe(chart => {
        this.laplaceOn = chart.isSubappOn('Laplace');
      }));
  }
}
