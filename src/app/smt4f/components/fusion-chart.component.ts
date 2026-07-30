import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FusionChart } from '../models/fusion-chart';
import { FusionDataService } from '../fusion-data.service';
import { FusionChartComponent } from '../../compendium/components/fusion-chart.component';

@Component({
  selector: 'app-fusion-chart-container',
  imports: [FusionChartComponent],
  template: `
    @if (hasLightDark) {
      <app-fusion-chart
        [lang]="lang"
        [normChart]="normChart"
        [tripChart]="normChart"
        [normTitle]="'Light and Neutral Normal Fusions'"
        [tripTitle]="'Dark Normal Fusions'"
        [mitaTable]="mitamaTable">
      </app-fusion-chart>
    }
    @if (!hasLightDark) {
      <app-fusion-chart
        [lang]="lang"
        [filterDarks]="false"
        [normChart]="normChart"
        [mitaTable]="mitamaTable">
      </app-fusion-chart>
    }
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
