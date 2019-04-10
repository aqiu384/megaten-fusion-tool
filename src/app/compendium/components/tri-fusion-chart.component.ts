import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { FusionChart, FusionTrioService } from '../models';
import { FUSION_TRIO_SERVICE } from '../constants';

@Component({
  selector: 'app-triple-fusion-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fusion-chart
      [normChart]="normChart"
      [tripChart]="tripChart"
      [normTitle]="'Normal Fusions'"
      [tripTitle]="'Triple Fusions'">
    </app-fusion-chart>
  `
})
export class TripleFusionChartComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  normChart: FusionChart;
  tripChart: FusionChart;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(FUSION_TRIO_SERVICE) private fusionTrioService: FusionTrioService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.fusionTrioService.squareChart.subscribe(chart => {
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
