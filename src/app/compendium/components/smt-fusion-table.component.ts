import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { FUSION_DATA_SERVICE } from '../constants';
import { Compendium, FusionChart, FusionDataService, FusionCalculator, NamePair, FusionPair } from '../models';
import { toFusionPairResult } from '../models/conversions';
import { CurrentDemonService } from '../current-demon.service';
import Translations from '../data/translations.json';

@Component({
  selector: 'app-smt-fusion-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fusion-pair-table
      [lang]="lang"
      [title]="currentDemon + (msgs.Title | translateComp:lang)"
      [leftHeader]="msgs.LeftHeader | translateComp:lang"
      [rightHeader]="msgs.RightHeader | translateComp:lang"
      [rowData]="fusionPairs">
    </app-fusion-pair-table>
  `
})
export class SmtFusionTableComponent implements OnInit, OnDestroy {
  calculator: FusionCalculator;
  compendium: Compendium;
  fusionChart: FusionChart;
  currentDemon: string;
  lang = 'en';
  fusionPairs: FusionPair[] = [];
  msgs = Translations.SmtFusionTableComponent;

  subscriptions: Subscription[] = [];
  toFusionPair = (currentDemon: string) => (names: NamePair) => toFusionPairResult(names, this.compendium);

  constructor(
    private currentDemonService: CurrentDemonService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(FUSION_DATA_SERVICE) private fusionDataService: FusionDataService
  ) { }

  ngOnInit() {
    this.calculator = this.fusionDataService.fusionCalculator;

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

      this.lang = this.currentDemon.charCodeAt(0) < 256 ? 'en' : 'ja';
      this.fusionPairs = this.calculator
        .getFusions(this.currentDemon, this.compendium, this.fusionChart)
        .map(this.toFusionPair(this.currentDemon));
    }
  }
}
