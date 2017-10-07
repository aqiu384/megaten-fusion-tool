import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { BaseStats, ResistanceElements, AffinityElements } from '../../smt4/models/constants';
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
      <table>
        <thead>
          <tr>
            <th colSpan="7">
              Lvl {{ demon.lvl | lvlToNumber }}
              {{ demon.race }}
              {{ demon.name }}
            </th>
          </tr>
          <tr>
            <th colSpan="7">Stats</th>
          </tr>
          <tr>
            <th *ngFor="let stat of statHeaders">{{ stat }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td *ngFor="let stat of demon.stats">{{ stat }}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr><th colspan="17">Resistances</th></tr>
          <tr>
            <th [style.width.%]="50" colSpan="8">Elemental</th>
            <th [style.width.%]="50" colSpan="8">Ailment</th>
          </tr>
          <tr>
            <th *ngFor="let element of resistanceHeaders">
              <div class="element-icon {{ element }}">{{ element }}</div>
            </th>
            <th *ngFor="let ailment of ailmentHeaders">{{ ailment }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td *ngFor="let resist of demon.resists"
            class="resists {{ resist }}">
              {{ resist }}
            </td>
            <td *ngFor="let ailment of demon.ailments"
            class="resists {{ ailment }}">
              {{ ailment }}
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th colSpan="12">Skill Affinities</th>
          </tr>
          <tr>
            <th *ngFor="let element of affinityHeaders">
              <div class="element-icon {{ element }}"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td *ngFor="let affinity of demon.affinities" class="affinity{{ affinity }}">
              {{ affinity | affinityToString }}
            </td>
          </tr>
        </tbody>
      </table>
      <app-demon-skills [compendium]="compendium" [skills]="demon.skills"></app-demon-skills>
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
