import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FusionChart } from '../models/fusion-chart';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-fusion-chart-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fusion-chart
      [normChart]="normChart"
      [tripChart]="normChart"
      [mitaTable]="mitaTable"
      [normTitle]="'Light and Neutral Normal Fusions'"
      [tripTitle]="'Dark Normal Fusions'">
    </app-fusion-chart>
    <app-fusion-chart
      [normChart]="tripChart"
      [tripChart]="tripChart"
      [mitaTable]="tripMitaTable"
      [normTitle]="'Light and Neutral Triple Fusions'"
      [tripTitle]="'Dark Triple Fusions'">
    </app-fusion-chart>
  `
})
export class FusionChartContainerComponent implements OnInit, OnDestroy {
  mitaTable = [
    ['Nigi', 'Nigi', 'Ara '],
            ['Nigi', 'Ara '],
                    ['Ara '],
                          []
  ];

  tripMitaTable = [
    ['Saki', 'Saki', 'Saki', 'Saki', 'None'],
            ['Kusi', 'Saki', 'None', 'Kusi'],
                    ['None', 'Saki', 'Kusi'],
                            ['Kusi', 'Kusi'],
                                    ['Kusi'],
                                          []
  ];

  subscriptions: Subscription[] = [];
  normChart: FusionChart;
  tripChart: FusionChart;
  counter = 0;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fusionDataService: FusionDataService
  ) { }

  ngOnInit() {
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
