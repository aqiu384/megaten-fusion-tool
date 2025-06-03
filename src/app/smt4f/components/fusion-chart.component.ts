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
      [normChart]="normChart"
      [mitaTable]="mitamaTable">
    </app-fusion-chart>
  `
})
export class FusionChartContainerComponent implements OnInit, OnDestroy {
  title: string;
  subscriptions: Subscription[] = [];
  normChart: FusionChart;
  hasLightDark: boolean;
  mitamaTable: string[][];
  lang = 'en';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fusionDataService: FusionDataService
  ) { }

  ngOnInit() {
    const compConfig = this.fusionDataService.compConfig;
    this.lang = compConfig.lang;
    this.mitamaTable = compConfig.elementTable.pairs || null;
    this.hasLightDark = compConfig.hasLightDark;
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
