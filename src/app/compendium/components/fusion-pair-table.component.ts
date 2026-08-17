import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PositionEdgesService } from '../../shared/position-edges.service';
import { PositionStickyDirective } from '../../shared/position-sticky.directive';
import { ColumnWidthsDirective } from '../../shared/column-widths.directive';

import { SortedTableHeaderComponent, SortedTableComponent } from '../../shared/sorted-table.component';
import { FusionPair } from '../models';
import { LvlToNumberPipe, TranslateCompPipe } from '../pipes';
import Translations from '../data/translations.json';

@Component({
  selector: 'tr.app-fusion-pair-table-row',
  imports: [CommonModule, RouterModule, LvlToNumberPipe],
  template: `
    <td class="price">{{ inGameCurrencySymbol+(data.price | number:'1.0-0') }}</td>
    <td>{{ data.race1 }}</td>
    <td>{{ data.lvl1 | lvlToNumber }}</td>
    <td><a routerLink="{{ leftBaseUrl }}/{{ data.name1 }}">{{ data.name1 }}</a></td>
    <td>{{ data.race2 }}</td>
    <td>{{ data.lvl2 | lvlToNumber }}</td>
    <td><a routerLink="{{ rightBaseUrl }}/{{ data.name2 }}">{{ data.name2 }}</a></td>
    @if (getNotes) { <td>{{ getNotes(data) }}</td> }
  `
})
export class FusionPairTableRowComponent {
  @Input() data: FusionPair;
  @Input() leftBaseUrl: string;
  @Input() rightBaseUrl: string;
  @Input() inGameCurrencySymbol: string;
  @Input() getNotes: (data: FusionPair) => string;
}

@Component({
  selector: 'tfoot.app-fusion-pair-table-header',
  imports: [CommonModule, RouterModule, TranslateCompPipe],
  template: `
    <tr>
      <th colspan="8" class="title">{{ title }}</th>
    </tr>
    <tr>
      <th rowspan="2" [style.width.%]="10" [ngClass]="[ 'sortable', sortDirClass(1) ]" (click)="nextSortFunIndex(1)">{{ msgs.Price | translateComp:lang }}</th>
      <th colspan="3" [style.width.%]="35">{{ leftHeader }}</th>
      <th colspan="3" [style.width.%]="35">{{ rightHeader }}</th>
      @if (getNotes) { <th rowspan="2" [style.width.%]="20">Notes</th> }
    </tr>
    <tr>
      <th [ngClass]="[ 'sortable', sortDirClass(2) ]" (click)="nextSortFunIndex(2)">{{ msgs.Race | translateComp:lang }}</th>
      <th [ngClass]="[ 'sortable', sortDirClass(3) ]" (click)="nextSortFunIndex(3)">Lvl</th>
      <th [ngClass]="[ 'sortable', sortDirClass(4) ]" (click)="nextSortFunIndex(4)">{{ msgs.Name | translateComp:lang }}</th>
      <th [ngClass]="[ 'sortable', sortDirClass(5) ]" (click)="nextSortFunIndex(5)">{{ msgs.Race | translateComp:lang }}</th>
      <th [ngClass]="[ 'sortable', sortDirClass(6) ]" (click)="nextSortFunIndex(6)">Lvl</th>
      <th [ngClass]="[ 'sortable', sortDirClass(7) ]" (click)="nextSortFunIndex(7)">{{ msgs.Name | translateComp:lang }}</th>
    </tr>
  `
})
export class FusionPairTableHeaderComponent extends SortedTableHeaderComponent {
  @Input() title: string;
  @Input() leftHeader: string;
  @Input() rightHeader: string;
  @Input() getNotes: (data: FusionPair) => string;
  @Input() lang = 'en';
  msgs = Translations.FusionPairTableComponent;
}

@Component({
  selector: 'app-fusion-pair-table',
  imports: [
    CommonModule,
    ColumnWidthsDirective, PositionStickyDirective,
    FusionPairTableHeaderComponent, FusionPairTableRowComponent,
    TranslateCompPipe
  ],
  providers: [PositionEdgesService],
  template: `
    <div>
      <table appPositionSticky class="list-table">
        <tfoot #stickyHeader appColumnWidths
          class="app-fusion-pair-table-header"
          [lang]="lang"
          [title]="title"
          [getNotes]="getNotes"
          [leftHeader]="leftHeader"
          [rightHeader]="rightHeader"
          [sortFunIndex]="sortFunIndex"
          (sortFunIndexChanged)="sortFunIndex = $event">
        </tfoot>
      </table>
      <table class="list-table">
        <tfoot #hiddenHeader appColumnWidths
          class="app-fusion-pair-table-header"
          [lang]="lang"
          [title]="title"
          [getNotes]="getNotes"
          [leftHeader]="leftHeader"
          [rightHeader]="rightHeader"
          [style.visibility]="'collapse'">
        </tfoot>
        <tbody>
          @if (!rowData.length) {
            <tr>
              <td colspan="8">{{ msgs.NoFusionsFound | translateComp:lang }}</td>
            </tr>
          }
          @for (data of rowData.slice(0, currRow); track data) {
            <tr
              class="app-fusion-pair-table-row"
              [ngClass]="data.notes"
              [data]="data"
              [getNotes]="getNotes"
              [leftBaseUrl]="leftBaseUrl"
              [rightBaseUrl]="rightBaseUrl"
              [inGameCurrencySymbol]="inGameCurrencySymbol">
            </tr>
          }
          @if (currRow < rowData.length) {
            <tr>
              <th class="nav" colspan="8"
                [style.height.em]="2"
                (click)="currRow = currRow + incrRow">
                Show next {{ incrRow }} out of {{ rowData.length - currRow }}
              </th>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class FusionPairTableComponent extends SortedTableComponent<FusionPair> implements OnInit {
  private _title = 'Ingredient 1 x Ingredient 2 = Result';

  @Input() raceOrder: { [race: string]: number };
  @Input() leftHeader = 'Ingredient 1';
  @Input() rightHeader = 'Ingredient 2';
  @Input() leftBaseUrl = '../..';
  @Input() rightBaseUrl = '../..';
  @Input() initRow = 500;
  @Input() incrRow = 500;
  @Input() getNotes: (pair: FusionPair) => string = null;
  @Input() lang = 'en';
  @Input() inGameCurrencySymbol: string;
  msgs = Translations.FusionPairTableComponent;

  sortFuns: ((f1: FusionPair, f2: FusionPair) => number)[] = [];
  currRow = this.initRow;

  @Input() set title(title: string) {
    this._title = title;
    this.currRow = this.initRow;
  }

  get title(): string {
    return this._title;
  }

  ngOnInit() {
    this.nextSortFuns();
  }

  nextSortFuns() {
    this.sortFuns = [];

    if (this.raceOrder) {
      this.sortFuns.push(
        (f1, f2) => f1.price - f2.price,
        (f1, f2) => f1.price - f2.price,
        (f1, f2) => (this.raceOrder[f1.race1] - this.raceOrder[f2.race1]) * 200 + f2.lvl1 - f1.lvl1,
        (f1, f2) => f1.lvl1 - f2.lvl1,
        (f1, f2) => f1.name1.localeCompare(f2.name1),
        (f1, f2) => (this.raceOrder[f1.race2] - this.raceOrder[f2.race2]) * 200 + f2.lvl2 - f1.lvl2,
        (f1, f2) => f1.lvl2 - f2.lvl2,
        (f1, f2) => f1.name2.localeCompare(f2.name2)
      );

      this.sort();
    }
  }

  getSortFun(sortFunIndex: number): (a: FusionPair, b: FusionPair) => number {
    return this.sortFuns[sortFunIndex];
  }
}
