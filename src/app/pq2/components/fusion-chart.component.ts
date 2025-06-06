import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { FusionChart } from '../../compendium/models';
import { Compendium } from '../models/compendium';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-fusion-chart-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fusion-chart
      [normChart]="normChart"
      [tripChart]="hasTripleFusion ? tripChart : null"
      [normTitle]="'Normal Fusions'"
      [tripTitle]="hasTripleFusion ? 'Triple Fusions' : null"
      [mitaTable]="hasMitamaFusion ? mitaTable : null"
      [isPersona]="true">
    </app-fusion-chart>
  `
})
export class FusionChartContainerComponent implements OnInit, OnDestroy {
  hasTripleFusion: boolean;
  hasMitamaFusion: boolean;
  subscriptions: Subscription[] = [];
  compendium: Compendium;
  normChart: FusionChart;
  tripChart: FusionChart;
  mitaTable = [];

  constructor(
    private fusionDataService: FusionDataService
  ) { }

  ngOnInit() {
    const compConfig = this.fusionDataService.compConfig;
    this.hasTripleFusion = compConfig.hasTripleFusion;
    this.hasMitamaFusion = compConfig.elementTable.elems.length > 0;
    this.subscriptions.push(
      this.fusionDataService.squareChart.subscribe(chart => {
        this.normChart = chart.normalChart;
        this.tripChart = chart.tripleChart;
        this.updateMitamas();
      }));

    if (this.hasMitamaFusion) {
      this.subscriptions.push(
        this.fusionDataService.compendium.subscribe(compendium => {
          this.compendium = compendium;
          this.updateMitamas();
        }));
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  updateMitamas() {
    if (!this.hasMitamaFusion || !this.compendium || !this.normChart) {
      return
    }

    const elemRaces = this.normChart.elementDemons.map(dname => this.compendium.getDemon(dname).race);
    const table = [];

    for (let i = 0; i < elemRaces.length; i++) {
      const raceA = elemRaces[i];
      table.push(elemRaces.slice(0, i + 1).map(raceB => this.normChart.getRaceFusion(raceA, raceB)));
    }

    this.mitaTable = table;
  }
}
