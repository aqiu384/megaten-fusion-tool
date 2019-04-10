import { Component, ChangeDetectionStrategy, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { DemonEntryContainerComponent as DECC } from '../../compendium/containers/demon-entry.component';
import { BaseStats, ResistanceElements, SkillElementOrder } from '../constants';
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
      <table>
        <thead>
          <tr>
            <th [attr.colSpan]="statHeaders.length + 2">
              Grade {{ demon.lvl }} {{ demon.race }} {{ demon.name }}
            </th>
          </tr>
          <tr>
            <th>Stats</th>
            <th *ngFor="let stat of statHeaders">{{ stat }}</th>
            <th>AI</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Base</td>
            <td *ngFor="let stat of demon.stats">{{ stat }}</td>
            <td>{{ aiTypes[demon.ai] }}</td>
          </tr>
          <tr>
            <td>Max</td>
            <td *ngFor="let stat of demon.mstats">{{ stat }}</td>
            <td>{{ aiTypes[demon.ai] }}</td>
          </tr>
        </tbody>
      </table>
      <app-demon-resists
        [resistHeaders]="resistanceHeaders"
        [resists]="demon.resists">
      </app-demon-resists>
      <app-demon-skills
        [title]="'Innate Skills'"
        [hasLvl]="false"
        [hasTarget]="true"
        [elemOrder]="elemOrder"
        [compendium]="compendium"
        [skillLevels]="demon.skills">
      </app-demon-skills>
      <app-demon-skills
        [title]="'Archetype Skills'"
        [hasTarget]="true"
        [elemOrder]="elemOrder"
        [compendium]="compendium"
        [skillLevels]="demon.learned">
      </app-demon-skills>
      <app-demon-skills
        [title]="'Gacha Skills'"
        [hasTarget]="true"
        [elemOrder]="elemOrder"
        [compendium]="compendium"
        [skillLevels]="demon.gacha">
      </app-demon-skills>
      <app-smt-fusions>
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
export class DemonEntryComponent implements OnChanges {
  @Input() name: string;
  @Input() demon: Demon;
  @Input() compendium: Compendium;

  reikos: { name: string; amount: number; }[] = [];
  aiTypes = { atk: 'Attack', sup: 'Support', rec: 'Recovery' };
  statHeaders = BaseStats;
  resistanceHeaders = ResistanceElements;
  elemOrder = SkillElementOrder;
  reikoCodes = { l: 'Law', n: 'Neutral', c: 'Chaos', u: 'Light', d: 'Dark'};
  sizeCodes = { s: 'Small', m: 'Medium', l: 'Large' };

  ngOnChanges() {
    this.reikos = [];

    for (const [name, amount] of Object.entries(this.demon.reikos)) {
      this.reikos.push({
        name: this.sizeCodes[name[1]] + ' ' + this.reikoCodes[name[0]],
        amount
      });
    }
  }
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
