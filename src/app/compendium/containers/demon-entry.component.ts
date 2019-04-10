import {
  OnInit,
  OnDestroy
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { Demon, Compendium, FusionDataService } from '../models';
import { CurrentDemonService } from '../../compendium/current-demon.service';

export abstract class DemonEntryContainerComponent implements OnInit, OnDestroy {
  protected subscriptions: Subscription[] = [];
  name: string;
  demon: Demon;
  compendium: Compendium;
  appName = 'Test App';

  constructor(
    private route2: ActivatedRoute,
    private title2: Title,
    private currentDemonService2: CurrentDemonService,
    private fusionDataService2: FusionDataService
  ) { }

  ngOnInit() {
    this.subscribeAll();
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  subscribeAll() {
    this.subscriptions.push(
      this.fusionDataService2.compendium.subscribe(comp => {
        this.compendium = comp;
        this.getDemonEntry();
      }));

    this.subscriptions.push(
      this.currentDemonService2.currentDemon.subscribe(name => {
        this.name = name;
        this.getDemonEntry();
      }));

    this.route2.params.subscribe(params => {
      this.currentDemonService2.nextCurrentDemon(params['demonName']);
    });
  }

  getDemonEntry() {
    if (this.compendium && this.name) {
      this.title2.setTitle(`${this.name} - ${this.appName}`);
      this.demon = this.compendium.getDemon(this.name);
    }
  }
}
