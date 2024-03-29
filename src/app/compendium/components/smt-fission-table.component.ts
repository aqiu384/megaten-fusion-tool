import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { FUSION_DATA_SERVICE } from '../constants';
import { Compendium, FusionChart, FusionDataService, FusionCalculator, FusionEntry, NamePair, FusionPair } from '../models';
import { toFusionEntry, toFusionPair } from '../models/conversions';

import { CurrentDemonService } from '../current-demon.service';

@Component({
  selector: 'app-smt-fission-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table *ngIf="fusionPrereq" class="list-table">
      <thead><tr><th class="title">{{ langEn ? 'Special Fusion Condition' : '合体条件' }}</th></tr></thead>
      <tbody><tr><td>{{ fusionPrereq }}</td></tr></tbody>
    </table>
    <app-fusion-entry-table *ngIf="fusionEntries.length"
      [langEn]="langEn"
      [title]="(langEn ? 'Special Fusion Ingredients for ' : '特殊合体 ') + currentDemon"
      [rowData]="fusionEntries"
      [isFusion]="true">
    </app-fusion-entry-table>
    <app-fusion-pair-table *ngIf="fusionPairs.length || !fusionEntries.length"
      [langEn]="langEn"
      [title]="(langEn ? 'Ingredient 1 x Ingredient 2 = ' : '悪魔1 x 悪魔2 = ') + currentDemon"
      [leftHeader]="langEn ? 'Ingredient 1' : '悪魔1'"
      [rightHeader]="langEn ? 'Ingredient 2' : '悪魔2'"
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
  langEn = true;
  fusionEntries: FusionEntry[] = [];
  fusionPairs: FusionPair[] = [];

  subscriptions: Subscription[] = [];
  toFusionEntry = (currentDemon: string) => (name: string) => toFusionEntry(name, this.compendium);
  toFusionPair = (currentDemon: string) => (names: NamePair) => toFusionPair(names, this.compendium);

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

      this.langEn = this.currentDemon.charCodeAt(0) < 256;
      this.fusionPrereq = this.compendium
        .getDemon(this.currentDemon).prereq;
      this.fusionEntries = this.compendium
        .getSpecialNameEntries(this.currentDemon)
        .map(this.toFusionEntry(this.currentDemon));
      this.fusionPairs = this.calculator
      .getFusions(this.currentDemon, this.compendium, this.fusionChart)
      .map(this.toFusionPair(this.currentDemon));
    }
  }
}
