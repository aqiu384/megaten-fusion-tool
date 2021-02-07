import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { FUSION_TRIO_SERVICE } from '../constants';
import { Compendium, FusionTrioService, FusionCalculator, TripleCalculator, NameTrio, DemonTrio, FusionTrio, SquareChart } from '../models';
import { toDemonTrio } from '../models/conversions';

import { CurrentDemonService } from '../../compendium/current-demon.service';

@Component({
  selector: 'app-triple-fission-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fusion-trio-table
      [title]="'Ingredient 1 x Ingredient 2 x Ingredient 3 = ' + currentDemon"
      [raceOrder]="chart.raceOrder"
      [rowData]="fissionTrios">
    </app-fusion-trio-table>
  `
})
export class TripleFissionTableComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  pairCalculator: FusionCalculator;
  calculator: TripleCalculator;
  compendium: Compendium;
  chart: SquareChart;
  currentDemon: string;
  fissionTrios: FusionTrio[] = [];

  toDemonTrio = (names: NameTrio) => toDemonTrio(names, this.compendium);
  sortDemonTrio = (a: DemonTrio, b: DemonTrio) => a.price - b.price;

  constructor(
    private route: ActivatedRoute,
    private currentDemonService: CurrentDemonService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(FUSION_TRIO_SERVICE) private fusionTrioService: FusionTrioService
  ) { }

  ngOnInit() {
    this.pairCalculator = this.fusionTrioService.fissionCalculator;
    this.calculator = this.fusionTrioService.triFissionCalculator;

    this.subscriptions.push(
      this.fusionTrioService.compendium.subscribe(compendium => {
        this.compendium = compendium;
        this.checkFissions();
      }));

    this.subscriptions.push(
      this.fusionTrioService.squareChart.subscribe(chart => {
        this.chart = chart;
        this.checkFissions();
      }));

    this.subscriptions.push(
      this.currentDemonService.currentDemon.subscribe(name => {
        this.currentDemon = name;
        this.checkFissions();
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  checkFissions() {
    if (this.compendium && this.chart && this.currentDemon) {
      this.changeDetectorRef.markForCheck();
      this.getFissions();
    }
  }

  getFissions() {
    const names = this.calculator.getFusions(
      this.currentDemon,
      this.compendium,
      this.chart
    );

    const demons = names.map(this.toDemonTrio);
    const fissions: { [name: string]: DemonTrio[] } = {};

    for (const trio of demons) {
      for (const name of [trio.d1.name, trio.d2.name, trio.d3.name]) {
        if (!fissions[name]) {
          fissions[name] = [];
        }

        fissions[name].push(trio);
      }
    }

    for (const recipes of Object.values(fissions)) {
      recipes.sort(this.sortDemonTrio);
    }

    this.fissionTrios = Object.entries(fissions).map(recipe => ({
      demon: this.compendium.getDemon(recipe[0]),
      minPrice: recipe[1][0].price,
      fusions: recipe[1]
    }));
  }
}
