import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { DemonListContainerComponent as DLCC } from '../../compendium/containers/demon-list.component';
import { FusionDataService } from '../fusion-data.service';
import { CompendiumConfig } from '../models';

@Component({
  selector: 'app-demon-list-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-smt-demon-list
      [isEnemy]="showEnemies"
      [hasCurrLvl]="!showEnemies"
      [raceOrder]="compConfig.raceOrder"
      [statHeaders]="statHeaders"
      [resistHeaders]="resistHeaders"
      [inheritOrder]="inheritOrder"
      [rowData]="demons | async">
    </app-smt-demon-list>
  `
})
export class DemonListContainerComponent extends DLCC {
  appName: string;
  statHeaders: string[];
  resistHeaders: string[];
  inheritOrder: { [elem: string]: number };
  compConfig: CompendiumConfig;

  constructor(
    title: Title,
    route: ActivatedRoute,
    changeDetectorRef: ChangeDetectorRef,
    fusionDataService: FusionDataService
  ) {
    super(title, changeDetectorRef, fusionDataService);
    this.showAllies = !route.snapshot.data.showShadows;
    this.showEnemies = !this.showAllies;

    this.compConfig = fusionDataService.compConfig;
    this.defaultSortFun = (d1, d2) => (
      this.compConfig.raceOrder[d1.race] -
      this.compConfig.raceOrder[d2.race]
    ) * 200 + d2.lvl - d1.lvl;

    this.appName = `List of Personas - ${fusionDataService.appName}`;
    this.statHeaders = this.compConfig.baseStats;
    this.resistHeaders = this.compConfig.resistElems;
    this.inheritOrder = this.compConfig.elemOrder;

    if (this.showEnemies) {
      this.appName = `List of Shadows - ${fusionDataService.appName}`;
      this.statHeaders = this.compConfig.enemyStats;
      this.resistHeaders = this.compConfig.enemyResists;
      this.inheritOrder = null;
    }
  }
}
