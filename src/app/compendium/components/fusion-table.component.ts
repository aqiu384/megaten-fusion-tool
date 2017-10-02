import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  Inject
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { COMPENDIUM_CONFIG } from '../constants';
import { CompendiumConfig } from '../models';

import { FusionTableHeaders, FusionRow } from '../models';
import { PositionEdgesService } from '../../shared/position-edges.service';
import { SortedTableHeaderComponent, SortedTableComponent } from '../../shared/sorted-table.component';

@Component({
  selector: 'tr.app-fusion-table-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <td>{{ data.race1 }}</td>
    <td>{{ data.lvl1 | lvlToNumber }}</td>
    <td><a routerLink="../../{{ data.name1 }}">{{ data.name1 }}</a></td>
    <td>{{ data.race2 }}</td>
    <td>{{ data.lvl2 | lvlToNumber }}</td>
    <td><a routerLink="../../{{ data.name2 }}">{{ data.name2 }}</a></td>
  `
})
export class FusionTableRowComponent {
  @Input() data: FusionRow;
}

@Component({
  selector: 'tfoot.app-fusion-table-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tr>
      <th colspan="3" [style.width.%]="50">{{ headers.left }}</th>
      <th colspan="3" [style.width.%]="50">{{ headers.right }}</th>
    </tr>
    <tr>
      <th class="sortable {{ sortDirClass(1) }}" (click)="nextSortFunIndex(1)">Race</th>
      <th class="sortable {{ sortDirClass(2) }}" (click)="nextSortFunIndex(2)">Lvl</th>
      <th class="sortable {{ sortDirClass(3) }}" (click)="nextSortFunIndex(3)">Name</th>
      <th class="sortable {{ sortDirClass(4) }}" (click)="nextSortFunIndex(4)">Race</th>
      <th class="sortable {{ sortDirClass(5) }}" (click)="nextSortFunIndex(5)">Lvl</th>
      <th class="sortable {{ sortDirClass(6) }}" (click)="nextSortFunIndex(6)">Name</th>
    </tr>
  `
})
export class FusionTableHeaderComponent extends SortedTableHeaderComponent {
  @Input() headers: FusionTableHeaders;
}

@Component({
  selector: 'app-fusion-table',
  providers: [ PositionEdgesService ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <table appPositionSticky>
        <tfoot #stickyHeader appColumnWidths
          class="app-fusion-table-header sticky-header"
          [headers]="headers"
          [sortFunIndex]="sortFunIndex"
          (sortFunIndexChanged)="sortFunIndex = $event">
        </tfoot>
      </table>
      <table>
        <tfoot #hiddenHeader appColumnWidths
          class="app-fusion-table-header"
          [style.visibility]="'collapse'"
          [headers]="headers">
        </tfoot>
        <tbody>
          <tr colspan="6" *ngIf="!rowData.length">
            <td>No fusion recipes found</td>
          </tr>
          <tr *ngFor="let data of rowData"
            class="app-fusion-table-row"
            [ngClass]="{ special: data.notes }"
            [data]="data">
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class FusionTableComponent extends SortedTableComponent<FusionRow> {
  @Input() headers: FusionTableHeaders;
  sortFuns: ((f1: FusionRow, f2: FusionRow) => number)[] = [];

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

  getSortFun(sortFunIndex: number): (a: FusionRow, b: FusionRow) => number {
    return this.sortFuns[sortFunIndex];
  }
}
