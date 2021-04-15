import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FusionChart } from '../../compendium/models';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-fusion-chart-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="!fullChart">
      <app-fusion-chart
        [normChart]="normChart"
        [tripChart]="normChart"
        [mitaTable]="mitamaTable"
        [normTitle]="'Light and Neutral Normal Fusions'"
        [tripTitle]="'Dark Normal Fusions'">
      </app-fusion-chart>
      <app-fusion-chart
        [normChart]="tripChart"
        [tripChart]="tripChart"
        [mitaTable]="tripleMitamaTable"
        [normTitle]="'Light and Neutral Triple Fusions'"
        [tripTitle]="'Dark Triple Fusions'">
      </app-fusion-chart>
    </ng-container>
    <ng-container *ngIf="fullChart && !hasDarkRanks">
      <app-fusion-chart
        [normChart]="fullChart"
        [mitaTable]="mitamaTable"
        [filterDarks]="false"
        [normTitle]="'Normal Fusions'">
      </app-fusion-chart>
      <app-species-triple-chart
        [speciesChart]="tripChart"
        [title]="appName + ' - Triple Fusions'">
      </app-species-triple-chart>
    </ng-container>
    <ng-container *ngIf="fullChart && hasDarkRanks">
      <app-fusion-chart
        [normChart]="fullChart"
        [tripChart]="fullChart"
        [mitaTable]="mitamaTable"
        [normTitle]="'Light and Neutral Normal Fusions'"
        [tripTitle]="'Dark Normal Fusions'">
      </app-fusion-chart>
      <app-species-triple-chart
        [speciesChart]="tripChart"
        [title]="appName + ' - Triple Fusions'">
      </app-species-triple-chart>
    </ng-container>
  `
})
export class FusionChartContainerComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  normChart: FusionChart;
  tripChart: FusionChart;
  fullChart: FusionChart;
  appName: string;
  hasDarkRanks: boolean;

  tripleMitamaTable: string[][];
  mitamaTable: string[][];

  constructor(private fusionDataService: FusionDataService) { }

  ngOnInit() {
    const compConfig = this.fusionDataService.compConfig;
    this.appName = compConfig.appTitle;
    this.mitamaTable = compConfig.mitamaTable;
    this.tripleMitamaTable = compConfig.tripleMitamaTable;
    this.hasDarkRanks = compConfig.darknessRecipes;

    if (this.fusionDataService.compConfig.useSpeciesFusion) {
      this.subscriptions.push(
        this.fusionDataService.fusionChart.subscribe(chart => {
          this.fullChart = chart;
        }));
    }

    this.subscriptions.push(
      this.fusionDataService.squareChart.subscribe(chart => {
        this.normChart = chart.normalChart;
        this.tripChart = chart.tripleChart;
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
