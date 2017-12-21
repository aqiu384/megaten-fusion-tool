import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { FusionChart } from '../models/fusion-chart';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-fusion-chart-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fusion-chart
      [normChart]="normChart"
      [mitaTable]="mitaTable"
      [normTitle]="isCursed ? 'Cursed Fusions' : 'Normal Fusions'">
    </app-fusion-chart>
  `
})
export class FusionChartContainerComponent implements OnInit, OnDestroy {
  isCursed = false;
  mitaTable = [
    ['Nigi', 'Ara ', 'Kusi'],
            ['Kusi', 'Ara '],
                    ['Saki'],
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
        this.isCursed = fusionChart.isCursed;
        this.normChart = fusionChart;
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
