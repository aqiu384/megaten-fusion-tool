import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RaceOrder, BaseStats, ResistanceElements } from '../constants';

import { DemonListContainerComponent as DLCC } from '../../compendium/containers/demon-list.component';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-demon-list-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-smt-demon-list
      [isEnemy]="showEnemies"
      [raceOrder]="raceOrder"
      [statHeaders]="statHeaders"
      [resistHeaders]="resistHeaders"
      [rowData]="demons | async">
    </app-smt-demon-list>
  `
})
export class DemonListContainerComponent extends DLCC {
  raceOrder = RaceOrder;
  statHeaders = BaseStats;
  resistHeaders = ResistanceElements;
  defaultSortFun = (d1, d2) => (RaceOrder[d1.race] - RaceOrder[d2.race]) * 200 + d2.lvl - d1.lvl;

  constructor(
    title: Title,
    route: ActivatedRoute,
    changeDetectorRef: ChangeDetectorRef,
    fusionDataService: FusionDataService
  ) {
    super(title, changeDetectorRef, fusionDataService);
    this.appName = `List of Personas - ${fusionDataService.appName}`;
    this.showAllies = !route.snapshot.data.showEnemies;
    this.showEnemies = !this.showAllies;

    if (this.showEnemies) {
      this.appName = `List of Demons - ${fusionDataService.appName}`;
      this.statHeaders = ['HP', 'MP'];
    }
  }
}
