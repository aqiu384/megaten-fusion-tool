import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, OnChanges, Inject, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../constants';
import { Compendium, FusionChart, SquareChart, FusionDataService, FusionTrioService, FusionCalculator, TripleCalculator } from '../models';
import { toFusionPair, toDemonTrio } from '../models/conversions';

@Component({
  selector: 'app-fission-preview-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="entry-table">
      <tbody>
        <tr><th class="title">Fission Previews</th></tr>
        <tr *ngFor="let preview of fissionPreviews">
          <th>{{ preview }}</th>
        </tr>
      </tbody>
    </table>
  `
})
export class FissionPreviewTableComponent implements OnChanges {
  @Input() pairCalculator: FusionCalculator;
  @Input() trioCalculator: TripleCalculator;
  @Input() pairChart: FusionChart;
  @Input() trioChart: SquareChart;
  @Input() compendium: Compendium;
  fissionPreviews: string[];

  ngOnChanges() {
    if (this.compendium && this.pairChart && (this.trioChart || !this.trioCalculator)) {
      const previews: string[] = [];

      for (const demon of this.compendium.allDemons.filter(d => !d.isEnemy)) {
        const fusionEntries = this.compendium
          .getSpecialNameEntries(demon.name);

        if (fusionEntries.length > 0) {
          previews.push(`${demon.name} = ${fusionEntries.join(' x ')}`);
          continue;
        }

        const fusionPairs = this.pairCalculator
          .getFusions(demon.name, this.compendium, this.pairChart)
          .map(p => toFusionPair(p, this.compendium));
        const fusionPairsValid = fusionPairs.length > 0 && (
          fusionPairs.filter(p => p.race1 !== demon.race).length > 0 || 
          !this.trioCalculator ||
          this.trioCalculator.getFusions(demon.name, this.compendium, this.trioChart).length === 0
        );
        
        if (fusionPairsValid) {
          fusionPairs.sort((a, b) => a.price - b.price);
          const previewPairs = fusionPairs.slice(0, 3).map(p => `${p.name1} x ${p.name2}`).join(', ');
          previews.push(`${demon.name} = ${previewPairs}` + (fusionPairs.length > 3 ? `, ${fusionPairs.length - 3} more...` : ''));
          continue;
        }

        if (this.trioCalculator) {
          const fusionTrios = this.trioCalculator
            .getFusions(demon.name, this.compendium, this.trioChart)
            .map(t => toDemonTrio(t, this.compendium))
            .filter(t => t.d1.race !== demon.race);
          
          if (fusionTrios.length > 0) {
            fusionTrios.sort((a, b) => a.price - b.price);
            const previewTrios = fusionTrios.slice(0, 3).map(t => `${t.d1.name} x ${t.d2.name} x ${t.d3.name}`).join(', ');
            previews.push(`${demon.name} = ${previewTrios}` + (fusionTrios.length > 3 ? `, ${fusionTrios.length - 3} more...` : ''));
            continue;
          }
        }

        if (demon.prereq) {
          previews.push(`${demon.name} = ${demon.prereq}`);
          continue;
        }

        previews.push(`${demon.name} = No fusions found!`);
      }

      this.fissionPreviews = previews;
    }
  }
}

@Component({
  selector: 'app-smt-fission-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fission-preview-table
      [pairCalculator]="calculator"
      [pairChart]="fusionChart"
      [compendium]="compendium">
    <app-fission-preview-table>
  `
})
export class SmtFissionPreviewComponent implements OnInit, OnDestroy {
  calculator: FusionCalculator;
  compendium: Compendium;
  fusionChart: FusionChart;
  subscriptions: Subscription[] = [];

  constructor(@Inject(FUSION_DATA_SERVICE) private fusionDataService: FusionDataService) { }

  ngOnInit() {
    this.calculator = this.fusionDataService.fissionCalculator;

    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(compendium => {
        this.compendium = compendium;
      }));

    this.subscriptions.push(
      this.fusionDataService.fusionChart.subscribe(fusionChart => {
        this.fusionChart = fusionChart;
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}

@Component({
  selector: 'app-trio-fission-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fission-preview-table
      [pairCalculator]="pairCalculator"
      [trioCalculator]="trioCalculator"
      [pairChart]="fusionChart.normalChart"
      [trioChart]="fusionChart"
      [compendium]="compendium">
    <app-fission-preview-table>
  `
})
export class TrioFissionPreviewComponent implements OnInit, OnDestroy {
  pairCalculator: FusionCalculator;
  trioCalculator: TripleCalculator;
  compendium: Compendium;
  fusionChart: SquareChart;
  subscriptions: Subscription[] = [];

  constructor(@Inject(FUSION_TRIO_SERVICE) private fusionTrioService: FusionTrioService) { }

  ngOnInit() {
    this.pairCalculator = this.fusionTrioService.fissionCalculator;
    this.trioCalculator = this.fusionTrioService.triFissionCalculator;

    this.subscriptions.push(
      this.fusionTrioService.compendium.subscribe(compendium => {
        this.compendium = compendium;
      }));

    this.subscriptions.push(
      this.fusionTrioService.squareChart.subscribe(chart => {
        this.fusionChart = chart;
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
