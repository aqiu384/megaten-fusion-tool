import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Compendium } from '../models/compendium';
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
  mitaTable = [];

  subscriptions: Subscription[] = [];
  compendium: Compendium;
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
        this.updateMitamas()
      }));

    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(compendium => {
        this.changeDetectorRef.markForCheck();
        this.compendium = compendium;
        this.updateMitamas()
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  updateMitamas() {
    if (!this.compendium || !this.normChart) {
      return
    }

    const elemRaces = this.normChart.elementDemons.map(dname => this.compendium.getDemon(dname).race);
    const table = [];

    for (let i = 0; i < elemRaces.length; i++) {
      const raceA = elemRaces[i];
      table.push(elemRaces.slice(i + 1, elemRaces.length).map(raceB => this.normChart.getRaceFusion(raceA, raceB)));
    }

    this.mitaTable = table;
  }
}
