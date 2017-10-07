import { Component, ChangeDetectionStrategy, Input, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { PositionEdgesService } from '../../shared/position-edges.service';
import { SortedTableHeaderComponent, SortedTableComponent } from '../../shared/sorted-table.component';
import { COMPENDIUM_CONFIG } from '../constants';
import { CompendiumConfig, FusionPair } from '../models';

@Component({
  selector: 'tr.app-fusion-pair-table-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <td>{{ data.race1 }}</td>
    <td>{{ data.lvl1 | lvlToNumber }}</td>
    <td><a routerLink="{{ baseUrl }}/{{ data.name1 }}">{{ data.name1 }}</a></td>
    <td>{{ data.race2 }}</td>
    <td>{{ data.lvl2 | lvlToNumber }}</td>
    <td><a routerLink="{{ baseUrl }}/{{ data.name2 }}">{{ data.name2 }}</a></td>
  `
})
export class FusionPairTableRowComponent {
  @Input() data: FusionPair;
  @Input() baseUrl: string;
}

@Component({
  selector: 'tfoot.app-fusion-pair-table-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tr>
      <th colspan="6">{{ title }}</th>
    </tr>
    <tr>
      <th colspan="3" [style.width.%]="50">{{ leftHeader }}</th>
      <th colspan="3" [style.width.%]="50">{{ rightHeader }}</th>
    </tr>
    <tr>
      <th [ngClass]="[ 'sortable', sortDirClass(1) ]" (click)="nextSortFunIndex(1)">Race</th>
      <th [ngClass]="[ 'sortable', sortDirClass(2) ]" (click)="nextSortFunIndex(2)">Lvl</th>
      <th [ngClass]="[ 'sortable', sortDirClass(3) ]" (click)="nextSortFunIndex(3)">Name</th>
      <th [ngClass]="[ 'sortable', sortDirClass(4) ]" (click)="nextSortFunIndex(4)">Race</th>
      <th [ngClass]="[ 'sortable', sortDirClass(5) ]" (click)="nextSortFunIndex(5)">Lvl</th>
      <th [ngClass]="[ 'sortable', sortDirClass(6) ]" (click)="nextSortFunIndex(6)">Name</th>
    </tr>
  `
})
export class FusionPairTableHeaderComponent extends SortedTableHeaderComponent {
  @Input() title;
  @Input() leftHeader;
  @Input() rightHeader;
}

@Component({
  selector: 'app-fusion-pair-table',
  providers: [ PositionEdgesService ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <table appPositionSticky>
        <tfoot #stickyHeader appColumnWidths
          class="app-fusion-pair-table-header"
          [title]="title"
          [leftHeader]="leftHeader"
          [rightHeader]="rightHeader"
          [sortFunIndex]="sortFunIndex"
          (sortFunIndexChanged)="sortFunIndex = $event">
        </tfoot>
      </table>
      <table>
        <tfoot #hiddenHeader appColumnWidths
          class="app-fusion-pair-table-header"
          [title]="title"
          [leftHeader]="leftHeader"
          [rightHeader]="rightHeader"
          [style.visibility]="'collapse'">
        </tfoot>
        <tbody>
          <tr *ngIf="rowData.length === 0">
            <td colspan="6">No fusions found!</td>
          </tr>
          <tr *ngFor="let data of rowData"
            class="app-fusion-pair-table-row"
            [ngClass]="{ special: data.notes }"
            [data]="data"
            [baseUrl]="baseUrl">
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class FusionPairTableComponent extends SortedTableComponent<FusionPair> {
  @Input() title = 'Ingredient 1 x Ingredient 2 = Result';
  @Input() leftHeader = 'Ingredient 1';
  @Input() rightHeader = 'Ingredient 2';
  @Input() baseUrl = '../..';

  sortFuns: ((f1: FusionPair, f2: FusionPair) => number)[] = [];

  constructor(@Inject(COMPENDIUM_CONFIG) private config: CompendiumConfig) {
    super();
    const { raceOrder } = config;
    this.sortFuns = [
      (f1, f2) => (raceOrder[f1.race1] - raceOrder[f2.race1]) * 100 + f2.lvl1 - f1.lvl1,
      (f1, f2) => (raceOrder[f1.race1] - raceOrder[f2.race1]) * 100 + f2.lvl1 - f1.lvl1,
      (f1, f2) => f1.lvl1 - f2.lvl1,
      (f1, f2) => f1.name1.localeCompare(f2.name1),
      (f1, f2) => (raceOrder[f1.race2] - raceOrder[f2.race2]) * 100 + f2.lvl2 - f1.lvl2,
      (f1, f2) => f1.lvl2 - f2.lvl2,
      (f1, f2) => f1.name2.localeCompare(f2.name2)
    ];
  }

  getSortFun(sortFunIndex: number): (a: FusionPair, b: FusionPair) => number {
    return this.sortFuns[sortFunIndex];
  }
}
