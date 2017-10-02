import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../constants';
import { FusionRow, Compendium, FusionChart, CompendiumConfig, FusionDataService } from '../models';
import { CurrentDemonService } from '../current-demon.service';

@Component({
  selector: 'app-forward-fusion-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fusion-table
      [headers]="headers"
      [rowData]="fusionRows | async">
    </app-fusion-table>
  `
})
export class ForwardFusionTableComponent implements OnInit, OnDestroy {
  static readonly HEADERS = {
    left: 'Ingredient 2',
    right: 'Result'
  };

  fusionRows: Observable<FusionRow[]>;
  compendium: Compendium;
  fusionChart: FusionChart;
  currentDemon: string;

  subscriptions: Subscription[] = [];
  headers = ForwardFusionTableComponent.HEADERS;

  constructor(
    private currentDemonService: CurrentDemonService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(COMPENDIUM_CONFIG) private compendiumConfig: CompendiumConfig,
    @Inject(FUSION_DATA_SERVICE) private fusionDataService: FusionDataService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(compendium => {
        this.compendium = compendium;
        this.getForwardFusions();
      }));

    this.subscriptions.push(
      this.fusionDataService.fusionChart.subscribe(fusionChart => {
        this.fusionChart = fusionChart;
        this.getForwardFusions();
      }));

    this.subscriptions.push(
      this.currentDemonService.currentDemon.subscribe(name => {
        this.currentDemon = name;
        this.getForwardFusions();
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  getForwardFusions() {
    if (this.compendium && this.fusionChart && this.currentDemon) {
      this.changeDetectorRef.markForCheck();
      this.fusionRows = Observable.create(observer => {
        observer.next(this.compendiumConfig.forwardFuse(this.currentDemon, this.compendium, this.fusionChart));
      });
    }
  }
}
