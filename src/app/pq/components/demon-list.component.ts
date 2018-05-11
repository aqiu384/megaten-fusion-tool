import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RaceOrder, BaseStats, ResistElements, APP_TITLE } from '../constants';

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
  appName = `List of Personas - ${APP_TITLE}`;
  raceOrder = RaceOrder;
  statHeaders = BaseStats;
  resistHeaders = null;
  defaultSortFun = (d1, d2) => (RaceOrder[d1.race] - RaceOrder[d2.race]) * 200 + d2.lvl - d1.lvl;

  constructor(
    title: Title,
    route: ActivatedRoute,
    changeDetectorRef: ChangeDetectorRef,
    fusionDataService: FusionDataService
  ) {
    super(title, changeDetectorRef, fusionDataService);
    this.showAllies = !route.snapshot.data.showShadows;
    this.showEnemies = !this.showAllies;

    if (this.showEnemies) {
      this.appName = `List of Shadows - ${APP_TITLE}`;
      this.statHeaders = ['HP', 'Atk', 'Def'];
      this.resistHeaders = ResistElements.concat('almighty');
    }
  }
}
