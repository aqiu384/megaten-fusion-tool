import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { DemonListContainerComponent as DLCC } from '../../compendium/containers/demon-list.component';
import { FusionDataService } from '../fusion-data.service';
import { CompendiumConfig } from '../models';
import { translateComp } from '../../compendium/models/translator';
import Translations from  '../../compendium/data/translations.json';

@Component({
  selector: 'app-demon-list-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-smt-demon-list
      [lang]="compConfig.lang"
      [isPersona]="!showEnemies"
      [isEnemy]="showEnemies"
      [hasCurrLvl]="!showEnemies && compConfig.hasTripleFusion"
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

    this.appName = translateComp(Translations.DemonListComponent.AppPersonas, this.compConfig.lang) + fusionDataService.appName;
    this.statHeaders = this.compConfig.baseStats;
    this.resistHeaders = this.compConfig.hasDemonResists ? this.compConfig.resistElems : [];
    this.inheritOrder = this.compConfig.elemOrder;

    if (this.showEnemies) {
      this.appName = translateComp(Translations.DemonListComponent.AppShadows, this.compConfig.lang) + fusionDataService.appName;
      this.statHeaders = this.compConfig.enemyStats;
      this.resistHeaders = this.compConfig.resistElems;
      this.inheritOrder = null;
    }

  }
}
