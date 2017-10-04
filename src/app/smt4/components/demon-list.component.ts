import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  OnInit,
  AfterViewChecked,
  OnDestroy
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import {
  BaseStats,
  ResistanceElements,
  RaceOrder,
  ElementOrder,
  ResistanceOrder
} from '../models/constants';
import { APP_TITLE } from '../models/constants';
import { Demon } from '../models';
import { Compendium } from '../models/compendium';

import { PositionEdgesService } from '../../shared/position-edges.service';
import { SortedTableHeaderComponent, SortedTableComponent } from '../../shared/sorted-table.component';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'tr.app-demon-table-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <td>{{ data.race }}</td>
    <td>{{ data.lvl | lvlToNumber }}</td>
    <td><a routerLink="{{ data.name }}">{{ data.name }}</a></td>
    <td *ngFor="let stat of data.stats">{{ stat }}</td>
    <td *ngFor="let resist of data.resists" class="resists {{ resist }}">{{ resist }}</td>
  `
})
export class DemonTableRowComponent {
  @Input() data: Demon;
}

@Component({
  selector: 'tfoot.app-demon-table-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tr>
      <th colspan="3">Demon</th>
      <th colspan="7">Base Stats</th>
      <th colspan="8">Resistances</th>
    </tr>
    <tr>
      <th class="sortable {{ sortDirClass(1) }}" (click)="nextSortFunIndex(1)">Race</th>
      <th class="sortable {{ sortDirClass(2) }}" (click)="nextSortFunIndex(2)">Lvl<span>--</span></th>
      <th class="sortable {{ sortDirClass(3) }}" (click)="nextSortFunIndex(3)">Name</th>
      <th *ngFor="let pair of statColIndices"
        class="sortable"
        (click)="nextSortFunIndex(pair.index)">
        {{ pair.stat }}
      </th>
      <th *ngFor="let pair of elemColIndices"
        class="sortable"
        (click)="nextSortFunIndex(pair.index)">
        <div class="element-icon {{ pair.element }}"></div>
      </th>
    </tr>
  `,
  styles: [`
    span {
      color: transparent;
    }
  `]
})
export class DemonTableHeaderComponent extends SortedTableHeaderComponent {
  static readonly STAT_COL_INDICES = BaseStats.map((stat, i) => ({ stat, index: i + 4 }));
  static readonly ELEM_COL_INDICES = ResistanceElements.map((element, i) => ({ element, index: i + 11 }));

  statColIndices = DemonTableHeaderComponent.STAT_COL_INDICES;
  elemColIndices = DemonTableHeaderComponent.ELEM_COL_INDICES;
}

@Component({
  selector: 'app-demon-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table appPositionSticky>
      <tfoot #stickyHeader appColumnWidths
        class="app-demon-table-header sticky-header"
        [sortFunIndex]="sortFunIndex"
        (sortFunIndexChanged)="sortFunIndex = $event">
      </tfoot>
    </table>
    <table>
      <tfoot #hiddenHeader appColumnWidths
        class="app-demon-table-header"
        [style.visibility]="'collapse'">
      </tfoot>
      <tbody>
        <tr *ngFor="let data of rowData"
          class="app-demon-table-row"
          [ngClass]="{
            special: data.fusion === 'special',
            exception: data.fusion !== 'normal' && data.fusion !== 'special'
          }" [data]="data">
        </tr>
      </tbody>
    </table>
  `
})
export class DemonListComponent extends SortedTableComponent<Demon> implements AfterViewChecked {
  static readonly SORT_FUNS: ((a: Demon, b: Demon) => number)[] = [
    (d1, d2) => (RaceOrder[d1.race] - RaceOrder[d2.race]) * 200 + d2.lvl - d1.lvl,
    (d1, d2) => (RaceOrder[d1.race] - RaceOrder[d2.race]) * 200 + d2.lvl - d1.lvl,
    (d1, d2) => d2.lvl - d1.lvl,
    (d1, d2) => d1.name.localeCompare(d2.name)
  ].concat(
    BaseStats.map((stat, index) =>
      (d1, d2) => d2.stats[index] - d1.stats[index]),
    ResistanceElements.map((element, index) =>
      (d1, d2) => ResistanceOrder[d2.resists[index]] - ResistanceOrder[d1.resists[index]])
  );

  ngAfterViewChecked() {
    this.matchColWidths();
  }

  getSortFun(sortFunIndex: number): (a: Demon, b: Demon) => number {
    return DemonListComponent.SORT_FUNS[sortFunIndex];
  }
}

@Component({
  selector: 'app-demon-list-container',
  providers: [ PositionEdgesService ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-list [rowData]="demons | async"></app-demon-list>
  `
})
export class DemonListContainerComponent implements OnInit, OnDestroy {
  demons: Observable<Demon[]>;
  subscriptions: Subscription[] = [];

  constructor(
    private title: Title,
    private fusionDataService: FusionDataService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.title.setTitle(`List of Demons - ${APP_TITLE}`);

    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(
        this.onCompendiumUpdated.bind(this)));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onCompendiumUpdated(compendium: Compendium) {
    this.changeDetectorRef.markForCheck();
    this.demons = Observable.create(observer => {
      const demons = compendium.getAllDemons();
      demons.sort(DemonListComponent.SORT_FUNS[0]);
      observer.next(demons.slice(0, 50));
      setTimeout(() => observer.next(demons));
    });
  }
}
