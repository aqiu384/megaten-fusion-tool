import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { FusionDataService } from '../fusion-data.service';
import { CompendiumConfig } from '../models';

@Component({
  selector: 'app-p5s-fusion-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="entry-table">
      <tbody>
        <tr><th class="title" colspan="2">{{ normTitle }}</th></tr>
        <tr *ngFor="let row of table">
          <th>{{ row.result }}</th>
          <td>{{ row.recipes }}</td>
        </tr>
      </tbody>
    </table>
  `
})
export class P5SFusionChartComponent implements OnChanges {
  @Input() compConfig: CompendiumConfig;
  @Input() normTitle: string;

  table: { result: string, recipe: string }[];

  ngOnChanges() {
    if (this.compConfig) {
      this.fillFusionChart();
    }
  }

  fillFusionChart() {
    const table = [];
    for (const [nameR, recipe] of Object.entries(this.compConfig.pairRecipes)) {
      table.push({ result: nameR, recipes: recipe.join(', ') });
    }
    this.table = table;
  }
}

@Component({
  selector: 'app-fusion-chart-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-p5s-fusion-chart
      [compConfig]="compConfig"
      [normTitle]="appName + ' - Normal Fusions'">
    </app-p5s-fusion-chart>
  `
})
export class FusionChartContainerComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  compConfig: CompendiumConfig;
  appName: string;

  constructor(
    private title2: Title,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private fusionDataService: FusionDataService
  ) {
    this.compConfig = fusionDataService.compConfig
  }

  ngOnInit() {
    this.subscriptions.push(
      this.route.parent.data.subscribe(data => {
        this.appName = data.appName;
        this.title2.setTitle(`Fusion Chart - ${data.appName} Fusion Calculator`);
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
