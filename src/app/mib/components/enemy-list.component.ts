import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Demon } from '../models';
import { Compendium } from '../models/compendium';
import { RaceOrder, BaseStats, ResistanceElements } from '../constants';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-enemy-list-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-smt-demon-list
      [raceOrder]="raceOrder"
      [statHeaders]="statHeaders"
      [resistHeaders]="resistHeaders"
      [rowData]="demons | async">
    </app-smt-demon-list>
  `
})
export class EnemyListContainerComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  demons: Observable<Demon[]>;
  appName = 'List of Demons - Megami ';
  initListLen = 50;
  raceOrder = RaceOrder;

  statHeaders = ['HP', 'MP'].concat(BaseStats);
  resistHeaders = ResistanceElements;
  showEnemies = true;
  defaultSortFun = (d1, d2) => (RaceOrder[d1.race] - RaceOrder[d2.race]) * 200 + d2.lvl - d1.lvl;

  constructor(
    private title2: Title,
    private changeDetectorRef: ChangeDetectorRef,
    private fusionDataService2: FusionDataService
  ) { }

  ngOnInit() {
    this.title2.setTitle(`List of Demons - ${this.fusionDataService2.appName}`);

    this.subscriptions.push(
      this.fusionDataService2.compendium.subscribe(
        this.onCompendiumUpdated.bind(this)));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onCompendiumUpdated(compendium: Compendium) {
    this.changeDetectorRef.markForCheck();
    this.demons = Observable.create(observer => {
      const demons = compendium.allEnemies;
      demons.sort(this.defaultSortFun);
      observer.next(demons.slice(0, this.initListLen));
      setTimeout(() => observer.next(demons));
    });
  }
}
