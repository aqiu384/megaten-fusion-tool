import {
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ColumnWidthsDirective } from './column-widths.directive';

import { PositionEdgesService } from '../shared/position-edges.service';
import { PositionStickyDirective } from '../shared/position-sticky.directive';

export abstract class SortedTableHeaderComponent {
  private sortAsc = true;
  private sortAscIndex = 1;

  @Output() sortFunIndexChanged = new EventEmitter<number>();

  get sortFunIndex(): number {
    return (this.sortAsc ? 1 : -1) * this.sortAscIndex;
  }

  @Input() set sortFunIndex(sortFunIndex: number) {
    this.sortAsc = sortFunIndex > 0;
    this.sortAscIndex = (this.sortAsc ? 1 : -1) * sortFunIndex;
  }

  sortDirClass(sortAscIndex: number): string {
    return this.sortAscIndex !== sortAscIndex ? 'none' :
      this.sortAsc ? 'asc' : 'desc';
  }

  nextSortFunIndex(sortAscIndex: number) {
    this.sortAsc = this.sortAscIndex !== sortAscIndex ? true : !this.sortAsc;
    this.sortAscIndex = sortAscIndex;
    this.sortFunIndexChanged.emit(this.sortFunIndex);
  }
}

export abstract class SortedTableComponent<TData> {
  @ViewChild(PositionStickyDirective) stickyTable: PositionStickyDirective;
  @ViewChild('stickyHeader', { read: ColumnWidthsDirective }) stickyHeader: ColumnWidthsDirective;
  @ViewChild('hiddenHeader', { read: ColumnWidthsDirective }) hiddenHeader: ColumnWidthsDirective;

  private _rowData: TData[] = [];
  private _sortFunIndex = 0;

  get rowData(): TData[] {
    return this._rowData;
  }

  @Input() set rowData(rowData: TData[]) {
    this._rowData = rowData;
    this.sort();
  }

  get sortFunIndex(): number {
    return this._sortFunIndex;
  }

  @Input() set sortFunIndex(sortFunIndex: number) {
    this._sortFunIndex = sortFunIndex;
    this.sort();
  }

  sort() {
    if (this.sortFunIndex >= 0) {
      this.rowData.sort(this.getSortFun(this.sortFunIndex));
    } else if (this.sortFunIndex < 0) {
      this.rowData.sort((a, b) => this.getSortFun(-1 * this.sortFunIndex)(b, a));
    }

    setTimeout(this.matchColWidths.bind(this));
  }

  matchColWidths() {
    if (this.stickyHeader && this.hiddenHeader) {
      this.stickyHeader.colWidths = this.hiddenHeader.colWidths;
    }
  }

  abstract getSortFun(sortFunIndex: number): (a: TData, b: TData) => number;
}
