import {
  ChangeDetectorRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Demon, Compendium, FusionDataService } from '../models';

export abstract class DemonListContainerComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  demons: Observable<Demon[]>;
  appName = 'List of Demons - Megami Tensei Fusion Tools';
  initListLen = 50;
  showAllies = true;
  showEnemies = false;
  defaultSortFun = (a: Demon, b: Demon) => a.name.localeCompare(b.name);

  constructor(
    private title2: Title,
    private changeDetectorRef: ChangeDetectorRef,
    private fusionDataService2: FusionDataService
  ) { }

  ngOnInit() {
    this.title2.setTitle(this.appName);

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
      let demons = compendium.allDemons;

      if (!this.showAllies) {
        demons = demons.filter(d => d.fusion === 'enemy');
      } if (!this.showEnemies) {
        demons = demons.filter(d => d.fusion !== 'enemy');
      }

      demons.sort(this.defaultSortFun);
      observer.next(demons.slice(0, this.initListLen));
      setTimeout(() => observer.next(demons));
    });
  }
}
