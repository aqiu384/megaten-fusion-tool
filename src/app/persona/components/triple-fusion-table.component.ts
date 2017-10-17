import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { FUSION_TRIO_SERVICE } from '../../compendium/constants';
import { Compendium, FusionChart, FusionTrioService, FusionCalculator, NameTrio, DemonTrio, FusionTrio } from '../../compendium/models';
import { toDemonTrio } from '../../compendium/models/conversions';

import { CurrentDemonService } from '../../compendium/current-demon.service';
import { fuseT1WithDiffRace, fuseN1WithDiffRace, fuseWithSameRace } from '../fusions/persona-triple-fusions';

import { RaceOrder } from '../../p4/constants';

@Component({
  selector: 'app-triple-fusion-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fusion-trio-table
      [title]="'Result = ' + currentDemon +  ' x Ingredient 2 x Ingredient 3'"
      [raceOrder]="raceOrder"
      [leftHeader]="'Result'"
      [rowData]="fusionTrios">
    </app-fusion-trio-table>
  `
})
export class TripleFusionTableComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  calculator: FusionCalculator;
  compendium: Compendium;
  normalChart: FusionChart;
  tripleChart: FusionChart;
  currentDemon: string;
  fusionTrios: FusionTrio[] = [];

  raceOrder = RaceOrder;
  toDemonTrio = (names: NameTrio) => toDemonTrio(names, this.compendium);
  sortDemonTrio = (a: DemonTrio, b: DemonTrio) => a.d1.lvl - b.d1.lvl;

  constructor(
    private route: ActivatedRoute,
    private currentDemonService: CurrentDemonService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(FUSION_TRIO_SERVICE) private fusionTrioService: FusionTrioService
  ) { }

  ngOnInit() {
    this.calculator = this.fusionTrioService.fissionCalculator;

    this.subscriptions.push(
      this.fusionTrioService.compendium.subscribe(compendium => {
        this.compendium = compendium;
        this.getFusions();
      }));

    this.subscriptions.push(
      this.fusionTrioService.squareChart.subscribe(chart => {
        this.normalChart = chart.normalChart;
        this.tripleChart = chart.tripleChart;
        this.getFusions();
      }));

    this.subscriptions.push(
      this.currentDemonService.currentDemon.subscribe(name => {
        this.currentDemon = name;
        this.getFusions();
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  getFusions() {
    if (this.compendium && this.normalChart && this.tripleChart && this.currentDemon) {
      this.changeDetectorRef.markForCheck();

      let names: NameTrio[] = [];

      for (const fuser of [fuseT1WithDiffRace, fuseN1WithDiffRace, fuseWithSameRace]) {
        names = names.concat(fuser(
          this.currentDemon,
          this.compendium,
          this.normalChart,
          this.tripleChart
        ));
      }

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
        fusions: recipe[1]
      }));
    }
  }
}
