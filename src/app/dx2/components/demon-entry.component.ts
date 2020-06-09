import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { DemonEntryContainerComponent as DECC } from '../../compendium/containers/demon-entry.component';
import { BaseStats, ResistanceElements } from '../constants';
import { Demon, Skill } from '../models';
import { Compendium } from '../models/compendium';

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
            <th [attr.colSpan]="statHeaders.length + 1">
              Grade {{ demon.lvl }} {{ demon.race }} {{ demon.name }}
            </th>
          </tr>
          <tr>
            <th *ngFor="let stat of statHeaders">{{ stat }}</th>
            <th>AI</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td *ngFor="let stat of demon.stats">{{ stat }}</td>
            <td>{{ aiTypes[demon.ai] }}</td>
          </tr>
        </tbody>
      </table>
      <app-demon-resists
        [resistHeaders]="resistanceHeaders"
        [resists]="demon.resists">
      </app-demon-resists>
      <table>
        <thead>
          <tr>
            <th [attr.colSpan]="7">Available Skills</th>
          </tr>
          <tr>
            <th>Available</th>
            <th>Elem</th>
            <th>Name</th>
            <th>Costs</th>
            <th>Effect</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let slvl of skillLvls">
            <td [ngClass]="['lvl' + slvl.source]">{{ lvlCodes[slvl.source] }}</td>
            <td><div class="element-icon {{ slvl.skill.element }}">{{ slvl.skill.element }}</div></td>
            <td>{{ slvl.skill.name }}</td>
            <td [style.color]="slvl.skill.cost ? null: 'transparent'">{{ slvl.skill.cost | skillCostToString }}</td>
            <td>{{ slvl.skill.effect }}</td>
            <td [style.color]="slvl.skill.rank !== 99 ? null: 'transparent'">{{ slvl.skill.rank }}</td>
          </tr>
        </tbody>
      </table>
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

  skillLvls: { skill: Skill; source: number; }[] = [];

  aiTypes = { atk: 'Attack', sup: 'Support', rec: 'Recovery' };
  statHeaders = BaseStats;
  resistanceHeaders = ResistanceElements;
  lvlCodes = {
    3367: 'Arch Com', 3365: 'Arch Ara', 3380: 'Arch Pro', 3389: 'Arch Psy', 3369: 'Arch Ele',
    0: 'Innate', 3965: 'Gach Ara', 3980: 'Gach Pro', 3989: 'Gach Psy', 3969: 'Gach Ele'
  }

  ngOnChanges() {
    this.skillLvls = this.demon.baseSkills.map(slvl => ({ skill: this.compendium.getSkill(slvl.skill), source: slvl.source }));
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
