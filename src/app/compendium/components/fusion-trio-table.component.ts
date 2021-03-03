import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
  AfterViewChecked
} from '@angular/core';

import { PositionEdgesService } from '../../shared/position-edges.service';
import { SortedTableComponent, SortedTableHeaderComponent } from '../../shared/sorted-table.component';
import { FusionTrio } from '../models';

@Component({
  selector: 'tbody.app-fusion-trio-table-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tr *ngIf="!showing">
      <th class="nav"
        [style.height.em]="1"
        (click)="toggleShowing.emit(showIndex)">
        Show
      </th>
      <td>{{ trio.minPrice }}</td>
      <td>{{ trio.demon.race }}</td>
      <td>{{ trio.demon.currLvl }}</td>
      <td><a routerLink="{{ baseUrl }}/{{ trio.demon.name }}">{{ trio.demon.name }}</a></td>
      <td colspan="6" [style.color]="'#666'">{{ trio.fusions.length }} recipes hidden</td>
    </tr>
    <ng-container *ngIf="showing">
      <tr>
        <th class="nav active"
          [style.height.em]="1"
          [attr.rowspan]="trio.fusions.length + 1"
          (click)="toggleShowing.emit(showIndex)">
          Hide
        </th>
      </tr>
      <tr *ngFor="let recipe of trio.fusions">
        <td>{{ recipe.price }}</td>
        <td>{{ trio.demon.race }}</td>
        <td>{{ trio.demon.currLvl }}</td>
        <td><a routerLink="{{ baseUrl }}/{{ trio.demon.name }}">{{ trio.demon.name }}</a></td>
        <ng-container *ngFor="let demon of [ recipe.d1, recipe.d2, recipe.d3 ]">
          <ng-container *ngIf="trio.demon !== demon">
            <td>{{ demon.race }}</td>
            <td>{{ demon.currLvl }}</td>
            <td><a routerLink="{{ baseUrl }}/{{ demon.name }}">{{ demon.name }}</a></td>
          </ng-container>
        </ng-container>
      </tr>
    </ng-container>
  `
})
export class FusionTrioTableRowComponent {
  @Input() trio: FusionTrio;
  @Input() showing: boolean;
  @Input() showIndex: number;
  @Input() baseUrl = '../../..';
  @Output() toggleShowing = new EventEmitter<number>();
}

@Component({
  selector: 'tfoot.app-fusion-trio-table-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tr>
      <th colspan="11" class="title">{{ title }}</th>
    </tr>
    <tr>
      <th class="sortable" rowspan="2" [style.width.%]="8" (click)="toggleHideAll()">Hide All</th>
      <th rowSpan="2" [style.width.%]="8" [ngClass]="[ 'sortable', sortDirClass(1) ]" (click)="nextSortFunIndex(1)">Price</th>
      <th colspan="3" [style.width.%]="28">{{ leftHeader }}</th>
      <th colspan="3" [style.width.%]="28">Ingredient 2</th>
      <th colspan="3" [style.width.%]="28">Ingredient 3</th>
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
  @Input() title;
  @Input() leftHeader;
  @Output() hideAll = new EventEmitter<boolean>();

  toggleHideAll() {
    this.hideAll.emit(true);
  }
}

@Component({
  selector: 'app-fusion-trio-table',
  providers: [ PositionEdgesService ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <table appPositionSticky class="list-table">
        <tfoot #stickyHeader appColumnWidths
          class="app-fusion-trio-table-header"
          [title]="title"
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
          [leftHeader]="leftHeader"
          [style.visibility]="'collapse'">
        </tfoot>
        <tbody *ngIf="!rowData.length">
          <tr><td colspan="11">No fusions found!</td></tr>
        </tbody>
        <tbody *ngFor="let data of rowData; let i = index"
          class="app-fusion-trio-table-row"
          [trio]="data"
          [showing]="showing[i]"
          [showIndex]="i"
          (toggleShowing)="toggleShowing($event)">
        </tbody>
      </table>
    </div>
  `
})
export class FusionTrioTableComponent extends SortedTableComponent<FusionTrio> implements OnInit, AfterViewChecked {
  @Input() title = 'Fusion Trio Table';
  @Input() leftHeader = 'Ingredient 1';
  @Input() raceOrder: { [race: string]: number };
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
