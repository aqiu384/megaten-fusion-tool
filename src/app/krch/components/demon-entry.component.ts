import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { DemonEntryContainerComponent as DECC } from '../../compendium/containers/demon-entry.component';
import { Demon, CompendiumConfig } from '../models';
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
        [fusionHeaders]="[ 'Personality' ]"
        [stats]="demon.stats">
        <td>{{ demon.person }}</td>
      </app-demon-stats>
      <app-demon-resists
        [resistHeaders]="compConfig.resistElems"
        [resists]="demon.resists">
      </app-demon-resists>
      <app-demon-skills
        [title]="'Innate Skills'"
        [hasTarget]="true"
        [elemOrder]="compConfig.elemOrder"
        [compendium]="compendium"
        [skillLevels]="demon.skills">
      </app-demon-skills>
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
