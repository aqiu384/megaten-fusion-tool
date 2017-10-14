import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { FUSION_DATA_SERVICE } from '../../compendium/constants';
import { Compendium, FusionChart, FusionDataService, FusionCalculator, NamePair, FusionPair } from '../../compendium/models';
import { toFusionEntry, toFusionPair } from '../../compendium/models/conversions';

import { CurrentDemonService } from '../../compendium/current-demon.service';

import { getFusionN2Rs, getFusionT1Rs } from '../../compendium/fusions/persona-triangle-fusions';

import { TriangleChart } from '../../p3/models/triangle-chart';
import { TriangleNormalChart } from '../../p3/models/triangle-normal-chart';

@Component({
  selector: 'app-triangle-fusion-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fusion-pair-table *ngIf="fusionPairs.length"
      [title]="currentTriangle + ' x ' + currentDemon + ' x Ingredient 3 = Result'"
      [leftHeader]="'Ingredient 3'"
      [rightHeader]="'Result'"
      [rowData]="fusionPairs">
    </app-fusion-pair-table>
  `
})
export class TriangleFusionTableComponent implements OnInit, OnDestroy {
  calculator: FusionCalculator;
  compendium: Compendium;
  fusionChart: FusionChart;
  currentDemon: string;
  currentTriangle: string;
  fusionPairs: FusionPair[] = [];
  triangleChart: FusionChart = new TriangleChart();
  triangleNormalChart: FusionChart = new TriangleNormalChart();

  subscriptions: Subscription[] = [];
  toFusionPair = (names: NamePair) => toFusionPair(names, this.compendium);

  constructor(
    private route: ActivatedRoute,
    private currentDemonService: CurrentDemonService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(FUSION_DATA_SERVICE) private fusionDataService: FusionDataService
  ) { }

  ngOnInit() {
    this.calculator = this.fusionDataService.fissionCalculator;

    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(compendium => {
        this.compendium = compendium;
        this.getForwardFusions();
      }));

    this.subscriptions.push(
      this.fusionDataService.fusionChart.subscribe(fusionChart => {
        this.fusionChart = fusionChart;
        this.getForwardFusions();
      }));

    this.subscriptions.push(
      this.currentDemonService.currentDemon.subscribe(name => {
        this.currentDemon = name;
        this.getForwardFusions();
      }));

    this.route.params.subscribe(params => {
      this.currentTriangle = params['triangleName'];
      this.getForwardFusions();
    });
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  getForwardFusions() {
    if (this.compendium && this.fusionChart && this.currentDemon && this.currentTriangle) {
      this.changeDetectorRef.markForCheck();

      this.fusionPairs = (getFusionN2Rs(
        this.currentDemon,
        this.currentTriangle,
        this.compendium,
        this.fusionChart,
        this.triangleChart
      )).concat(getFusionN2Rs(
        this.currentTriangle,
        this.currentDemon,
        this.compendium,
        this.fusionChart,
        this.triangleChart
      )).concat(getFusionT1Rs(
        this.currentTriangle,
        this.currentDemon,
        this.compendium,
        this.fusionChart,
        this.triangleChart
      )).map(this.toFusionPair);
    }
  }
}
