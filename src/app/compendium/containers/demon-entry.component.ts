import {
  Component,
  ChangeDetectorRef,
  Inject,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { FUSION_DATA_SERVICE } from '../constants';
import { Demon, Compendium, FusionDataService } from '../models';
import { CurrentDemonService } from '../../compendium/current-demon.service';

export abstract class DemonEntryContainerComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  protected name: string;
  protected demon: Demon;
  protected compendium: Compendium;
  protected appName = 'Test App';

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private currentDemonService: CurrentDemonService,
    @Inject(FUSION_DATA_SERVICE) private fusionDataService: FusionDataService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(comp => {
        this.compendium = comp;
        this.getDemonEntry();
      }));

    this.subscriptions.push(
      this.currentDemonService.currentDemon.subscribe(name => {
        this.name = name;
        this.getDemonEntry();
      }));

    this.route.params.subscribe(params => {
      this.currentDemonService.nextCurrentDemon(params['demonName']);
    });
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  getDemonEntry() {
    if (this.compendium && this.name) {
      this.title.setTitle(`${this.name} - ${this.appName}`);
      this.demon = this.compendium.getDemon(this.name);
    }
  }
}
