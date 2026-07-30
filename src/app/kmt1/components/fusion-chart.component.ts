import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FusionChart } from '../../compendium/models';
import { FusionDataService } from '../fusion-data.service';

import { CommonModule } from '@angular/common';
import { FusionChartComponent } from '../../compendium/components/fusion-chart.component';

@Component({
  selector: 'app-fusion-chart-container',
  imports: [CommonModule, FusionChartComponent],
  template: `
    <app-fusion-chart
      [normChart]="normChart"
      [filterDarks]="false"
      [normTitle]="'Normal Fusions'">
    </app-fusion-chart>
  `
})
export class FusionChartContainerComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  normChart: FusionChart;
  appName: string;

  constructor(private fusionDataService: FusionDataService) { }

  ngOnInit() {
    const compConfig = this.fusionDataService.compConfig;
    this.appName = compConfig.appTitle;

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
