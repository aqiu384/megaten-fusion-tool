import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FusionChart } from '../models/fusion-chart';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-fusion-chart-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fusion-chart
      [langEn]="langEn"
      [normChart]="normChart"
      [tripChart]="normChart"
      [normTitle]="langEn ? 'Light and Neutral Normal Fusions' : 'LIGHT合体'"
      [tripTitle]="langEn ? 'Dark Normal Fusions' : 'DARK合体'">
    </app-fusion-chart>
  `
})
export class FusionChartContainerComponent implements OnInit, OnDestroy {
  title: string;
  subscriptions: Subscription[] = [];
  normChart: FusionChart;
  langEn: boolean;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fusionDataService: FusionDataService
  ) { }

  ngOnInit() {
    this.langEn = this.fusionDataService.compConfig.lang !== 'ja';
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
