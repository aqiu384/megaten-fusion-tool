import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Demon } from '../../compendium/models';
import { DemonEntryContainerComponent as DECC } from '../../compendium/containers/demon-entry.component';
import { CompendiumConfig } from '../models';
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
        [statHeaders]="compConfig.baseStats"
        [stats]="demon.stats"
        [inherit]="demon.inherit">
      </app-demon-stats>
      <app-demon-resists
        [resistHeaders]="compConfig.resistElems"
        [resists]="demon.resists">
      </app-demon-resists>
      <app-demon-inherits
        [inheritHeaders]="compConfig.inheritElems"
        [inherits]="compendium.getInheritElems(demon.inherit)">
      </app-demon-inherits>
      <app-demon-skills
        [elemOrder]="compConfig.elemOrder"
        [compendium]="compendium"
        [skillLevels]="demon.skills">
      </app-demon-skills>
      <table *ngIf="demon.prereq">
        <tr><th class="title">Special Fusion Condition</th></tr>
        <tr><td>{{ demon.prereq }}</td></tr>
      </table>
      <ng-container *ngIf="compendium.splitSpecialFusion(name) as rows">
        <table *ngIf="rows.length">
          <tr><th colspan=4 class="title">Special Fusion Ingredients for {{ name }}</th></tr>
          <tr><th>Price</th><th>Race</th><th>Lvl</th><th>Name</th></tr>
          <tr *ngFor="let row of rows">
            <td>{{ row.price }}</td>
            <td>{{ row.race1 }}</td>
            <td>{{ row.lvl1 }}</td>
            <td><a routerLink="../{{ row.name1 }}">{{ row.name1 }}</a></td>
          </tr>
        </table>
      </ng-container>
      <app-smt-fusions>
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
  @Input() compConfig: CompendiumConfig;
}

@Component({
  selector: 'app-demon-entry-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-entry
      [name]="name"
      [demon]="demon"
      [compConfig]="compConfig"
      [compendium]="compendium">
    </app-demon-entry>
  `
})
export class DemonEntryContainerComponent extends DECC {
  compConfig: CompendiumConfig;

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private currentDemonService: CurrentDemonService,
    private fusionDataService: FusionDataService
  ) {
    super(route, title, currentDemonService, fusionDataService);
    this.appName = fusionDataService.appName;
    this.compConfig = fusionDataService.compConfig;
  }
}
