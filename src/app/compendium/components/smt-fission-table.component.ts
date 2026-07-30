import { Component, ChangeDetectorRef, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { FUSION_DATA_SERVICE } from '../constants';
import { Compendium, FusionChart, FusionDataService, FusionCalculator, FusionEntry, NamePair, FusionPair } from '../models';
import { toFusionEntry, toFusionPair } from '../models/conversions';
import { CurrentDemonService } from '../current-demon.service';
import { FusionEntryTableComponent } from './fusion-entry-table.component';
import { FusionPairTableComponent } from './fusion-pair-table.component';
import { TranslateCompPipe } from '../pipes';
import Translations from '../data/translations.json';

@Component({
  selector: 'app-smt-fission-table',
  imports: [FusionEntryTableComponent, FusionPairTableComponent, TranslateCompPipe],
  templateUrl: './smt-fission-table.component.html'
})
export class SmtFissionTableComponent implements OnInit, OnDestroy {
  calculator: FusionCalculator;
  compendium: Compendium;
  fusionChart: FusionChart;
  currentDemon: string;
  fusionPrereq = '';
  lang = 'en';
  hasFissionFromDemons = false;
  fusionEntries: FusionEntry[] = [];
  fusionPairs: FusionPair[] = [];
  msgs = Translations.SmtFissionTableComponent;

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
    this.lang = this.fusionDataService.lang;

    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(compendium => {
        this.compendium = compendium;
        this.getReverseFissions();
      }));

    this.subscriptions.push(
      this.fusionDataService.fusionChart.subscribe(fusionChart => {
        this.fusionChart = fusionChart;
        this.getReverseFissions();
      }));

    this.subscriptions.push(
      this.currentDemonService.currentDemon.subscribe(name => {
        this.currentDemon = name;
        this.getReverseFissions();
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  getFusionPairs(): FusionPair[] {
    return this.calculator
      .getFusions(this.currentDemon, this.compendium, this.fusionChart)
      .map(this.toFusionPair(this.currentDemon));
  }

  getReverseFissions() {
    if (this.compendium && this.fusionChart && this.currentDemon) {
      this.changeDetectorRef.markForCheck();
      this.fusionPrereq = this.compendium
        .getDemon(this.currentDemon).prereq;
      this.fusionEntries = this.compendium
        .getSpecialNameEntries(this.currentDemon)
        .map(this.toFusionEntry(this.currentDemon));
      this.fusionPairs = this.getFusionPairs();
    }
  }
}
