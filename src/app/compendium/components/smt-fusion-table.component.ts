import { Component, ChangeDetectorRef, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { FUSION_DATA_SERVICE } from '../constants';
import { Compendium, FusionChart, FusionDataService, FusionCalculator, NamePair, FusionPair } from '../models';
import { toFusionPairResult } from '../models/conversions';
import { CurrentDemonService } from '../current-demon.service';
import { FusionPairTableComponent } from './fusion-pair-table.component';
import { TranslateCompPipe } from '../pipes';
import Translations from '../data/translations.json';

@Component({
  selector: 'app-smt-fusion-table',
  imports: [FusionPairTableComponent, TranslateCompPipe],
  templateUrl: './smt-fusion-table.component.html'
})
export class SmtFusionTableComponent implements OnInit, OnDestroy {
  calculator: FusionCalculator;
  compendium: Compendium;
  fusionChart: FusionChart;
  currentDemon: string;
  lang = 'en';
  hasFusionToPersonas = false;
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
    this.lang = this.fusionDataService.lang;

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
      this.fusionPairs = this.calculator
        .getFusions(this.currentDemon, this.compendium, this.fusionChart)
        .map(this.toFusionPair(this.currentDemon));
    }
  }
}
