import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FusionChart } from '../models/fusion-chart';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-fusion-chart-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fusion-chart *ngIf="hasLightDark"
      [lang]="lang"
      [normChart]="normChart"
      [tripChart]="normChart"
      [normTitle]="'Light and Neutral Normal Fusions'"
      [tripTitle]="'Dark Normal Fusions'">
    </app-fusion-chart>
    <app-fusion-chart *ngIf="!hasLightDark"
      [lang]="lang"
      [filterDarks]="false"
      [normChart]="normChart">
    </app-fusion-chart>
  `
})
export class FusionChartContainerComponent implements OnInit, OnDestroy {
  title: string;
  subscriptions: Subscription[] = [];
  normChart: FusionChart;
  hasLightDark: boolean;
  lang = 'en';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fusionDataService: FusionDataService
  ) { }

  ngOnInit() {
    this.lang = this.fusionDataService.compConfig.lang;
    this.hasLightDark = this.fusionDataService.compConfig.hasLightDark;
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
