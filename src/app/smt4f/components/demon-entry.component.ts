import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { DemonEntryContainerComponent as DECC } from '../../compendium/containers/demon-entry.component';
import { CompendiumConfig, Demon } from '../models';
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
        [stats]="demon.stats">
      </app-demon-stats>
      <app-demon-resists
        [resistHeaders]="compConfig.resistElems"
        [resists]="demon.resists"
        [ailmentHeaders]="compConfig.ailmentElems"
        [ailments]="demon.ailments">
      </app-demon-resists>
      <app-demon-inherits *ngIf="demon.affinities"
        [hasLvls]="true"
        [inheritHeaders]="compConfig.affinityElems"
        [inherits]="demon.affinities">
      </app-demon-inherits>
      <app-demon-skills
        [hasTarget]="true"
        [hasRank]="true"
        [elemOrder]="compConfig.elemOrder"
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
    <app-demon-missing *ngIf="!demon" [name]="name">
    </app-demon-missing>
  `
})
export class DemonEntryComponent {
  @Input() name: string;
  @Input() demon: Demon;
  @Input() compConfig: CompendiumConfig;
  @Input() compendium: Compendium;
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
