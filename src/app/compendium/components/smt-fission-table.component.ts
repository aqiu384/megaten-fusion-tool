import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { FUSION_DATA_SERVICE } from '../constants';
import { Compendium, FusionChart, FusionDataService, FusionCalculator, FusionEntry, NamePair, FusionPair } from '../models';
import { toFusionEntry, toFusionPair } from '../models/conversions';

import { CurrentDemonService } from '../current-demon.service';

@Component({
  selector: 'app-smt-fission-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table *ngIf="fusionPrereq">
      <thead><tr><th>Special Fusion Condition</th></tr></thead>
      <tbody><tr><td>{{ fusionPrereq }}</td></tr></tbody>
    </table>
    <app-fusion-entry-table *ngIf="fusionEntries.length"
      [title]="'Special Fusion Ingredients for ' + currentDemon"
      [rowData]="fusionEntries">
    </app-fusion-entry-table>
    <app-fusion-pair-table *ngIf="fusionPairs.length"
      [title]="'Ingredient 1 x Ingredient 2 = ' + currentDemon"
      [rowData]="fusionPairs">
    </app-fusion-pair-table>
  `
})
export class SmtFissionTableComponent implements OnInit, OnDestroy {
  calculator: FusionCalculator;
  compendium: Compendium;
  fusionChart: FusionChart;
  currentDemon: string;
  fusionPrereq = '';
  fusionEntries: FusionEntry[] = [];
  fusionPairs: FusionPair[] = [];

  subscriptions: Subscription[] = [];
  toFusionEntry = (name: string) => toFusionEntry(name, this.compendium);
  toFusionPair = (names: NamePair) => toFusionPair(names, this.compendium);

  constructor(
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
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  getForwardFusions() {
    if (this.compendium && this.fusionChart && this.currentDemon) {
      this.changeDetectorRef.markForCheck();

      this.fusionPrereq = this.compendium
        .getDemon(this.currentDemon).prereq;
      this.fusionEntries = this.compendium
        .getSpecialNameEntries(this.currentDemon)
        .map(this.toFusionEntry);
      this.fusionPairs = this.calculator
        .getFusions(this.currentDemon, this.compendium, this.fusionChart)
        .map(this.toFusionPair);
    }
  }
}
