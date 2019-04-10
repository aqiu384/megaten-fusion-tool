import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FusionChart } from '../models/fusion-chart';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-fusion-chart-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fusion-chart
      [counter]="counter"
      [normChart]="normChart"
      [tripChart]="normChart"
      [normTitle]="'Light and Neutral Normal Fusions'"
      [tripTitle]="'Dark Normal Fusions'"
      [mitaTable]="mitaTable">
    </app-fusion-chart>
  `
})
export class FusionChartContainerComponent implements OnInit, OnDestroy {
  mitaTable = [
    ['Kusi', 'Saki', 'Ara ', 'Kusi', 'Kusi', 'Saki', 'Ara '],
            ['Nigi', 'Nigi', 'Kusi', 'Nigi', 'Saki', 'Nigi'],
                    ['Ara ', 'Saki', 'Nigi', 'Saki', 'Ara '],
                            ['Kusi', 'Nigi', 'Ara ', 'Ara '],
                                    ['Kusi', 'Saki', 'Kusi'],
                                            ['Saki', 'Nigi'],
                                                    ['Ara '],
                                                          []
  ];

  subscriptions: Subscription[] = [];
  normChart: FusionChart;
  counter = 0;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fusionDataService: FusionDataService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.fusionDataService.fusionChart.subscribe(fusionChart => {
        this.changeDetectorRef.markForCheck();
        this.normChart = fusionChart;
        this.counter += 1;
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
