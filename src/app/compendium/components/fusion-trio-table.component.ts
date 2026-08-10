import { Component, ChangeDetectorRef, Input, output, OnInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PositionEdgesService } from '../../shared/position-edges.service';
import { SortedTableComponent, SortedTableHeaderComponent } from '../../shared/sorted-table.component';
import { FusionTrio } from '../models';
import { ColumnWidthsDirective } from '../../shared/column-widths.directive';
import { PositionStickyDirective } from '../../shared/position-sticky.directive';

@Component({
  selector: 'tbody.app-fusion-trio-table-row',
  imports: [CommonModule, RouterModule],
  template: `
    @if (!showing) {
      <tr>
        <th class="nav"
          [style.height.em]="1"
          (click)="toggleShowing.emit(showIndex)">
          Show
        </th>
        <td>{{ inGameCurrencySymbol +( trio.minPrice | number:'1.0-0' ) }}</td>
        <td>{{ trio.demon.race }}</td>
        <td>{{ trio.demon.currLvl }}</td>
        <td><a routerLink="{{ baseUrl }}/{{ trio.demon.name }}">{{ trio.demon.name }}</a></td>
        <td colspan="7" [style.color]="'#666'">{{ trio.fusions.length }} recipes hidden</td>
      </tr>
    }
    @if (showing) {
      <tr>
        <th class="nav active"
          [style.height.em]="1"
          [attr.rowspan]="trio.fusions.length + 1"
          (click)="toggleShowing.emit(showIndex)">
          Hide
        </th>
      </tr>
      @for (recipe of trio.fusions; track recipe) {
        <tr>
          <td>{{ inGameCurrencySymbol + ( recipe.price | number:'1.0-0' ) }}</td>
          <td>{{ trio.demon.race }}</td>
          <td>{{ trio.demon.currLvl }}</td>
          <td><a routerLink="{{ baseUrl }}/{{ trio.demon.name }}">{{ trio.demon.name }}</a></td>
          @for (demon of [ recipe.d1, recipe.d2, recipe.d3 ]; track demon) {
            @if (trio.demon !== demon) {
              <td>{{ demon.race }}</td>
              <td>{{ demon.currLvl }}</td>
              <td><a routerLink="{{ baseUrl }}/{{ demon.name }}">{{ demon.name }}</a></td>
            }
          }
          @if (getNotes) { <td>{{ getNotes(recipe.d1.name, recipe.d2.name, recipe.d3.name) }}</td> }
        </tr>
      }
    }
  `
})
export class FusionTrioTableRowComponent {
  @Input() trio: FusionTrio;
  @Input() showing: boolean;
  @Input() showIndex: number;
  @Input() baseUrl = '../../..';
  @Input() inGameCurrencySymbol: string;
  @Input() getNotes: (demon1: string, demon2: string, demon3: string) => string;
  toggleShowing = output<number>();
}

@Component({
  selector: 'tfoot.app-fusion-trio-table-header',
  imports: [CommonModule],
  template: `
    <tr>
      <th colspan="12" class="title">{{ title }}</th>
    </tr>
    <tr>
      <th class="sortable" rowspan="2" [style.width.%]="10" (click)="toggleHideAll()">Hide All</th>
      <th rowSpan="2" [style.width.%]="10" [ngClass]="[ 'sortable', sortDirClass(1) ]" (click)="nextSortFunIndex(1)">Price</th>
      <th colspan="3" [style.width.%]="20">{{ leftHeader }}</th>
      <th colspan="3" [style.width.%]="20">Ingredient 2</th>
      <th colspan="3" [style.width.%]="20">Ingredient 3</th>
      @if (getNotes) { <th rowspan="2" [style.width.%]="20">Notes</th> }
    </tr>
    <tr>
      <th [ngClass]="[ 'sortable', sortDirClass(2) ]" (click)="nextSortFunIndex(2)">Race</th>
      <th [ngClass]="[ 'sortable', sortDirClass(3) ]" (click)="nextSortFunIndex(3)">Lvl<span>--</span></th>
      <th [ngClass]="[ 'sortable', sortDirClass(4) ]" (click)="nextSortFunIndex(4)">Name</th>
      <th>Race</th>
      <th>Lvl</th>
      <th>Name</th>
      <th>Race</th>
      <th>Lvl</th>
      <th>Name</th>
    </tr>
  `,
  styles: [`
    span {
      color: transparent;
    }
  `]
})
export class FusionTrioTableHeaderComponent extends SortedTableHeaderComponent {
  @Input() title: string;
  @Input() leftHeader: string;
  @Input() getNotes: (demon1: string, demon2: string, demon3: string) => string;
  hideAll = output<boolean>();

  toggleHideAll() {
    this.hideAll.emit(true);
  }
}

@Component({
  selector: 'app-fusion-trio-table',
  imports: [
    CommonModule,
    ColumnWidthsDirective, PositionStickyDirective,
    FusionTrioTableHeaderComponent, FusionTrioTableRowComponent
  ],
  providers: [PositionEdgesService],
  template: `
    <div>
      <table appPositionSticky class="list-table">
        <tfoot #stickyHeader appColumnWidths
          class="app-fusion-trio-table-header"
          [title]="title"
          [getNotes]="getNotes"
          [leftHeader]="leftHeader"
          [sortFunIndex]="sortFunIndex"
          (hideAll)="toggleHideAll()"
          (sortFunIndexChanged)="sortFunIndex = $event">
        </tfoot>
      </table>
      <table class="list-table">
        <tfoot #hiddenHeader appColumnWidths
          class="app-fusion-trio-table-header"
          [title]="title"
          [getNotes]="getNotes"
          [leftHeader]="leftHeader"
          [style.visibility]="'collapse'">
        </tfoot>
        @if (!rowData.length) {
          <tbody>
            <tr><td colspan="12">No fusions found!</td></tr>
          </tbody>
        }
        @for (data of rowData; track data; let i = $index) {
          <tbody
            class="app-fusion-trio-table-row"
            [trio]="data"
            [getNotes]="getNotes"
            [showing]="showing[i]"
            [showIndex]="i"
            [inGameCurrencySymbol]="inGameCurrencySymbol"
            (toggleShowing)="toggleShowing($event)">
          </tbody>
        }
      </table>
    </div>
  `
})
export class FusionTrioTableComponent extends SortedTableComponent<FusionTrio> implements OnInit, AfterViewChecked {
  @Input() title = 'Fusion Trio Table';
  @Input() leftHeader = 'Ingredient 1';
  @Input() raceOrder: { [race: string]: number };
  @Input() inGameCurrencySymbol: string;
  @Input() getNotes: (demon1: string, demon2: string, demon3: string) => string;
  showing: boolean[] = [];

  protected sortFuns: ((a: FusionTrio, b: FusionTrio) => number)[] = [];

  constructor(private changeDetector: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.nextSortFuns();
  }

  ngAfterViewChecked() {
    this.matchColWidths();
  }

  toggleShowing(hideIndex: number) {
    this.showing[hideIndex] = !this.showing[hideIndex];
  }

  toggleHideAll() {
    for (let i = 0; i < this.showing.length; i++) {
      this.showing[i] = false;
    }
  }

  nextSortFuns() {
    this.sortFuns = [];

    if (this.raceOrder) {
      this.sortFuns.push(
        (a, b) => a.minPrice - b.minPrice,
        (a, b) => a.minPrice - b.minPrice,
        (a, b) => (this.raceOrder[a.demon.race] - this.raceOrder[b.demon.race]) * 200 + a.demon.currLvl - b.demon.currLvl,
        (a, b) => a.demon.currLvl - b.demon.currLvl,
        (a, b) => a.demon.name.localeCompare(b.demon.name)
      );

      this.sort();
    }
  }

  getSortFun(sortFunIndex: number): (a: FusionTrio, b: FusionTrio) => number {
    return this.sortFuns[sortFunIndex];
  }
}
