import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { FusionChart } from '../../compendium/models';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-fusion-chart-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="!fullChart">
      <app-fusion-chart
        [normChart]="normChart"
        [tripChart]="normChart"
        [normTitle]="'Light and Neutral Normal Fusions'"
        [tripTitle]="'Dark Normal Fusions'">
      </app-fusion-chart>
      <app-fusion-chart
        [normChart]="tripChart"
        [tripChart]="tripChart"
        [normTitle]="'Light and Neutral Triple Fusions'"
        [tripTitle]="'Dark Triple Fusions'">
      </app-fusion-chart>
    </ng-container>
    <ng-container *ngIf="fullChart">
      <app-fusion-chart
        [normChart]="fullChart"
        [normTitle]="'Normal Fusions'">
      </app-fusion-chart>
      <app-fusion-chart
        [normChart]="tripChart"
        [normTitle]="'Triple Fusions'">
      </app-fusion-chart>
    </ng-container>
  `
})
export class FusionChartContainerComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  normChart: FusionChart;
  tripChart: FusionChart;
  fullChart: FusionChart;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fusionDataService: FusionDataService
  ) { }

  ngOnInit() {
    if (this.fusionDataService.compConfig.useSpeciesFusion) {
      this.subscriptions.push(
        this.fusionDataService.fusionChart.subscribe(chart => {
          this.fullChart = chart;
        }));
    }

    this.subscriptions.push(
      this.fusionDataService.squareChart.subscribe(chart => {
        this.normChart = chart.normalChart;
        this.tripChart = chart.tripleChart;
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
