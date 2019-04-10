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
      [mitaTable]="mitaTable">
    </app-fusion-chart>
  `
})
export class FusionChartContainerComponent implements OnInit, OnDestroy {
  appName = 'Raidou Kuzunoha vs. King Abaddon';
  mitaTable = [
    ['Nigi', 'Undi', 'Nigi', 'Ara ', 'Kusi'],
            ['Ara ', 'Sylp', 'Kusi', 'Nigi'],
                    ['Ara ', 'Nigi', 'Kusi'],
                            ['Kusi', 'Ara '],
                                    ['Saki'],
                                          []
  ];

  subscriptions: Subscription[] = [];
  normChart: FusionChart;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fusionDataService: FusionDataService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.fusionDataService.fusionChart.subscribe(fusionChart => {
        this.changeDetectorRef.markForCheck();
        this.normChart = fusionChart;
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
