import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FusionChart } from '../../compendium/models';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-fusion-chart-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fusion-chart
      [normChart]="normChart"
      [mitaTable]="mitamaTable">
    </app-fusion-chart>
  `
})
export class FusionChartContainerComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  normChart: FusionChart;
  appName: string;
  mitamaTable: string[][];

  constructor(private fusionDataService: FusionDataService) { }

  ngOnInit() {
    const compConfig = this.fusionDataService.compConfig;
    this.appName = compConfig.appTitle;
    this.mitamaTable = compConfig.elementTable.pairs || null;

    this.subscriptions.push(
      this.fusionDataService.fusionChart.subscribe(chart => {
        this.normChart = chart;
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
