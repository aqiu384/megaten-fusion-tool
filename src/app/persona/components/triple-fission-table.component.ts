import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { FUSION_TRIO_SERVICE } from '../../compendium/constants';
import { Compendium, FusionChart, FusionTrioService, FusionCalculator, NameTrio, DemonTrio, FusionTrio } from '../../compendium/models';
import { toDemonTrio } from '../../compendium/models/conversions';

import { CurrentDemonService } from '../../compendium/current-demon.service';
import { splitWithDiffRace, splitWithSameRace } from '../fusions/persona-triple-fissions';

import { RaceOrder } from '../../p3/constants';

@Component({
  selector: 'app-triple-fission-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fusion-trio-table
      [raceOrder]="raceOrder"
      [rowData]="fissionTrios">
    </app-fusion-trio-table>
  `
})
export class TripleFissionTableComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  calculator: FusionCalculator;
  compendium: Compendium;
  normalChart: FusionChart;
  tripleChart: FusionChart;
  currentDemon: string;
  fissionTrios: FusionTrio[] = [];

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
        this.getFissions();
      }));

    this.subscriptions.push(
      this.fusionTrioService.squareChart.subscribe(chart => {
        this.normalChart = chart.normalChart;
        this.tripleChart = chart.tripleChart;
        this.getFissions();
      }));

    this.subscriptions.push(
      this.currentDemonService.currentDemon.subscribe(name => {
        this.currentDemon = name;
        this.getFissions();
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  getFissions() {
    if (this.compendium && this.normalChart && this.tripleChart && this.currentDemon) {
      this.changeDetectorRef.markForCheck();

      let names: NameTrio[] = [];

      for (const splitter of [splitWithDiffRace, splitWithSameRace]) {
        names = names.concat(splitter(
          this.currentDemon,
          this.compendium,
          this.normalChart,
          this.tripleChart
        ));
      }

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
        fusions: recipe[1]
      }));
    }
  }
}
