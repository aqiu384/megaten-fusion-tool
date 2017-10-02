import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FusionTypes } from '../constants';
import { FusionRow, Compendium, FusionChart, CompendiumConfig, FusionDataService } from '../models';
import { CurrentDemonService } from '../current-demon.service';

@Component({
  selector: 'app-special-reverse-fusion-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table>
      <thead>
        <tr>
          <th colspan="4">Special Fusion Recipe</th>
        </tr>
        <tr>
          <th>Race</th>
          <th>Lvl</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let ingredient of ingredients">
          <td>{{ ingredient.race1 }}</td>
          <td>{{ ingredient.lvl1 }}</td>
          <td colspan="2"><a routerLink="../../{{ ingredient.name1 }}">{{ ingredient.name1 }}</a></td>
        </tr>
      </tbody>
    </table>
  `
})
export class SpecialReverseFusionTableComponent {
  @Input() ingredients: FusionRow[];
}

@Component({
  selector: 'app-exception-reverse-fusion-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table>
      <thead>
        <tr>
          <th>Special Fusion Condition</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td *ngIf="fusionType === 'recruit'">Recruitment Only</td>
          <td *ngIf="fusionType === 'accident'">Fusion Accident Only</td>
          <td *ngIf="fusionType === 'password'">Password Only</td>
          <td *ngIf="fusionType === 'notowned'">DLC marked as not owned</td>
        </tr>
      </tbody>
    </table>
  `
})
export class ExceptionReverseFusionTableComponent {
  @Input() fusionType: string;
}

@Component({
  selector: 'app-reverse-fusion-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="results$ | async as results">
      <app-fusion-table *ngIf="results.type === 'normal'"
        [rowData]="results.data" [headers]="headers">
      </app-fusion-table>
      <app-special-reverse-fusion-table *ngIf="results.type === 'special'"
        [ingredients]="results.data">
      </app-special-reverse-fusion-table>
      <app-exception-reverse-fusion-table *ngIf="isFusionException(results.type)"
        [fusionType]="results.type">
      </app-exception-reverse-fusion-table>
    <ng-container>
  `
})
export class ReverseFusionTableComponent implements OnInit, OnDestroy {
  static readonly EXCEPTION_CONDITIONS = [ 'recruit', 'accident', 'password', 'notowned' ];
  static readonly HEADERS = {
    left: 'Ingredient 1',
    right: 'Ingredient 2'
  };

  headers = ReverseFusionTableComponent.HEADERS;
  compendium: Compendium;
  fusionChart: FusionChart;
  currentDemon: string;

  results$: Observable<{ type: string, data: FusionRow[]}>;
  subscriptions: Subscription[] = [];

  constructor(
    private currentDemonService: CurrentDemonService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(COMPENDIUM_CONFIG) private compendiumConfig: CompendiumConfig,
    @Inject(FUSION_DATA_SERVICE) private fusionDataService: FusionDataService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(compendium => {
        this.compendium = compendium;
        this.getReverseFusions();
      }));

    this.subscriptions.push(
      this.fusionDataService.fusionChart.subscribe(fusionChart => {
        this.fusionChart = fusionChart;
        this.getReverseFusions();
      }));

    this.subscriptions.push(
      this.currentDemonService.currentDemon.subscribe(name => {
        this.currentDemon = name;
        this.getReverseFusions();
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  getReverseFusions() {
    if (this.compendium && this.fusionChart && this.currentDemon) {
      this.changeDetectorRef.markForCheck();
      this.results$ = Observable.create(observer => {
        observer.next(this.compendiumConfig.reverseFuse(this.currentDemon, this.compendium, this.fusionChart));
      });
    }
  }

  isFusionException(condition: string): boolean {
    return ReverseFusionTableComponent.EXCEPTION_CONDITIONS.indexOf(condition) !== -1;
  }
}
