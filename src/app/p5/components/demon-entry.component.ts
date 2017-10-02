import { Component, ChangeDetectionStrategy, Input, OnInit, AfterViewChecked, OnDestroy, ViewChild, OnChanges } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { BaseStats, ResistanceElements, APP_TITLE } from '../models/constants';
import { Demon } from '../models';
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
            <th colSpan="6">
              Lvl {{ demon.lvl }}
              {{ demon.race }}
              {{ name }}
            </th>
          </tr>
          <tr>
            <th *ngFor="let stat of statHeaders">{{ stat }}</th>
            <th>Inherits</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td *ngFor="let stat of demon.stats">{{ stat }}</td>
            <td><div class="element-icon {{ demon.inherits }}">{{ demon.inherits }}</div></td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th colSpan="10">Elemental Resistances</th>
          </tr>
          <tr>
            <th *ngFor="let element of resistanceHeaders">
              <div class="element-icon {{ element }}"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td *ngFor="let resist of demon.resists"
            class="resists {{ resist }}">
              {{ resist }}
            </td>
          </tr>
        </tbody>
      </table>
      <app-demon-skills [compendium]="compendium" [skillLevels]="demon.skills"></app-demon-skills>
      <app-fusion-recipes></app-fusion-recipes>
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
}

@Component({
  selector: 'app-demon-entry-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-entry [name]="name" [demon]="demon" [compendium]="compendium"></app-demon-entry>
  `
})
export class DemonEntryContainerComponent implements OnInit, OnDestroy {
  name: string;
  demon: Demon;
  compendium: Compendium;

  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private fusionDataService: FusionDataService,
    private currentDemonService: CurrentDemonService
  ) { }

  ngOnInit() {
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

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  getDemonEntry() {
    if (this.compendium && this.name) {
      this.demon = this.compendium.getDemon(this.name);
      this.title.setTitle(`${this.name} - ${APP_TITLE}`);
    }
  }
}
