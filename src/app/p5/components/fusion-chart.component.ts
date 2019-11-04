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
      [mitaTable]="mitaTable"
      [isPersona]="true">
    </app-fusion-chart>
  `
})
export class FusionChartContainerComponent implements OnInit, OnDestroy {
  mitaTable = [
    ['Moon', 'Hang', 'Temp', 'Love', 'Deat', 'Towe', 'Stre'],
            ['Empe', 'Empr', 'Magi', 'Devi', 'Deat', 'Magi'],
                    ['Just', 'Herm', 'Char', 'Prie', 'Fool'],
                            ['Sun ', 'Towe', 'Devi', 'Herm'],
                                    ['Temp', 'Empe', 'Star'],
                                            ['Temp', 'Hier'],
                                                    ['Moon'],
                                                          []
  ];

  royalMitaTable = [
    ['Moon', 'Hang', 'Temp', 'Fait', 'Deat', 'Towe', 'Stre'],
            ['Empe', 'Empr', 'Magi', 'Devi', 'Deat', 'Magi'],
                    ['Just', 'Herm', 'Fait', 'Prie', 'Fool'],
                            ['Sun ', 'Towe', 'Devi', 'Herm'],
                                    ['Temp', 'Empe', 'Star'],
                                            ['Temp', 'Hier'],
                                                    ['Moon'],
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
