import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { FUSION_TRIO_SERVICE } from '../constants';
import { Compendium, FusionTrioService, FusionCalculator, TripleCalculator, NameTrio, DemonTrio, FusionTrio, SquareChart } from '../models';
import { toDemonTrioResult } from '../models/conversions';

import { CurrentDemonService } from '../../compendium/current-demon.service';

@Component({
  selector: 'app-triple-fusion-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fusion-trio-table
      [title]="'Result = Lvl ' + compendium.getDemon(currentDemon).currLvl + ' ' + currentDemon +  ' x Ingredient 2 x Ingredient 3'"
      [raceOrder]="chart.raceOrder"
      [leftHeader]="'Result'"
      [rowData]="fusionTrios">
    </app-fusion-trio-table>
  `
})
export class TripleFusionTableComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  pairCalculator: FusionCalculator;
  calculator: TripleCalculator;
  compendium: Compendium;
  chart: SquareChart;
  currentDemon: string;
  fusionTrios: FusionTrio[] = [];

  toDemonTrio = (names: NameTrio) => toDemonTrioResult(names, this.compendium);
  sortDemonTrio = (a: DemonTrio, b: DemonTrio) => a.price - b.price;

  constructor(
    private route: ActivatedRoute,
    private currentDemonService: CurrentDemonService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(FUSION_TRIO_SERVICE) private fusionTrioService: FusionTrioService
  ) { }

  ngOnInit() {
    this.pairCalculator = this.fusionTrioService.fusionCalculator;
    this.calculator = this.fusionTrioService.triFusionCalculator;

    this.subscriptions.push(
      this.fusionTrioService.compendium.subscribe(compendium => {
        this.compendium = compendium;
        this.checkFusions();
      }));

    this.subscriptions.push(
      this.fusionTrioService.squareChart.subscribe(chart => {
        this.chart = chart;
        this.checkFusions();
      }));

    this.subscriptions.push(
      this.currentDemonService.currentDemon.subscribe(name => {
        this.currentDemon = name;
        this.checkFusions();
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  checkFusions() {
    if (this.compendium && this.chart && this.currentDemon) {
      this.changeDetectorRef.markForCheck();
      this.getFusions();
    }
  }

  getFusions() {
    const names = this.calculator.getFusions(
      this.currentDemon,
      this.compendium,
      this.chart
    );

    const demons = names.map(this.toDemonTrio);
    const fusions: { [name: string]: DemonTrio[] } = {};

    for (const trio of demons) {
      if (!fusions[trio.d3.name]) {
        fusions[trio.d3.name] = [];
      }

      fusions[trio.d3.name].push(trio);
    }

    for (const recipes of Object.values(fusions)) {
      recipes.sort(this.sortDemonTrio);
    }

    this.fusionTrios = Object.entries(fusions).map(recipe => ({
      demon: this.compendium.getDemon(recipe[0]),
      minPrice: recipe[1][0].price,
      fusions: recipe[1]
    }));
  }
}
