import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { BaseStats, ResistanceElements, InheritElements, Ailments, APP_TITLE } from '../models/constants';
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
            <th colSpan="10">
              Lvl {{ demon.lvl | lvlToNumber }}
              {{ demon.align }}
              {{ demon.race }}
              {{ demon.name }}
            </th>
          </tr>
          <tr>
            <th colSpan="7">Stats</th>
            <th colSpan="3">Fusion</th>
          </tr>
          <tr>
            <th *ngFor="let stat of statHeaders">{{ stat }}</th>
            <th>Attack</th>
            <th>Password</th>
            <th>Requirements</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td *ngFor="let stat of demon.stats">{{ stat }}</td>
            <td *ngIf="!demon.attack">Physical 1x to single foe</td>
            <td *ngIf="demon.attack as attack">
              {{ attack.element ? attack.element : 'Physical' }}
              x{{ attack.hits ? attack.hits : '1' }}
              to {{ attack.target ? attack.target : 'single foe' }}
              {{ attack.ailment ? '- ' + attack.ailment : '' }}
            </td>
            <td><div *ngFor="let word of demon.password"><code>{{ word }}</code></div></td>
            <td [style.width.%]="30"><div *ngFor="let req of compendium.getFusionRequirements(name)">{{ req }}</div></td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr><th colspan="17">Resistances</th></tr>
          <tr>
            <th [style.width.%]="50" colSpan="8">Elemental</th>
            <th [style.width.%]="50" colSpan="9">Ailment</th>
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
              [style.color]="ailment !== 100 ? null : 'transparent'">
              {{ ailment }}
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr><th colspan="16">Inherits</th></tr>
          <tr><th *ngFor="let element of inheritanceHeaders">
            <div class="element-icon {{ element }}">{{ element }}</div>
          </th></tr>
        </thead>
        <tbody>
          <tr>
            <td *ngFor="let element of inheritanceHeaders"
              [style.color]="demon.inherits.indexOf(element) !== -1 ? null : 'transparent'">
              {{ demon.inherits.indexOf(element) !== -1 ? 'yes' : 'no' }}
            </td>
          </tr>
        </tbody>
      </table>
      <app-demon-skills [compendium]="compendium" [skills]="demon.skills">
        Innate Skills
      </app-demon-skills>
      <app-demon-skills [compendium]="compendium" [skills]="demon.source">
        D-Source Skills
      </app-demon-skills>
      <app-fusion-recipes [showFusionAlert]="laplaceOn">
        Laplace Subapp Enabled (Result Lvl +4)
      </app-fusion-recipes>
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
  resistanceHeaders = ResistanceElements;
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
export class DemonEntryContainerComponent implements OnInit, OnDestroy {
  name: string;
  demon: Demon;
  compendium: Compendium;
  laplaceOn = false;

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
      this.fusionDataService.fusionChart.subscribe(chart => {
        this.laplaceOn = chart.isSubappOn('Laplace');
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
