import { Directive } from '@angular/core';
import { Input, OnInit, AfterViewChecked } from '@angular/core';
import { SortedTableComponent } from '../../shared/sorted-table.component';
import { Demon } from '../models';

@Directive()
export class DemonListComponent<TDemon extends Demon> extends SortedTableComponent<TDemon> implements OnInit, AfterViewChecked {
  @Input() raceOrder: { [race: string]: number };
  @Input() inheritOrder: { [elem: string]: number };
  @Input() statHeaders: string[];
  @Input() resistHeaders: string[];
  @Input() affinityHeaders: string[];
  protected sortFuns: ((a: TDemon, b: TDemon) => number)[] = [];

  ngOnInit() {
      this.nextSortFuns();
  }

  ngAfterViewChecked() {
    this.matchColWidths();
  }

  nextSortFuns() {
    this.sortFuns = [];

    if (this.raceOrder) {
      this.sortFuns.push(
        (a, b) => (this.raceOrder[a.race] - this.raceOrder[b.race]) * 200 + b.lvl - a.lvl,
        (a, b) => (this.raceOrder[a.race] - this.raceOrder[b.race]) * 200 + b.lvl - a.lvl,
        (a, b) => b.lvl - a.lvl,
        (a, b) => a.name.localeCompare(b.name)
      );
    }

    if (this.inheritOrder) {
      this.sortFuns.push(
        (a, b) => (a.inherits - b.inherits),
      );
    }

    if (this.statHeaders) {
      this.sortFuns = this.sortFuns.concat(
        this.statHeaders.map((stat, index) => (a, b) => b.stats[index] - a.stats[index])
      );
    }

    if (this.resistHeaders) {
      this.sortFuns = this.sortFuns.concat(
        this.resistHeaders.map((elem, index) => (a, b) => a.resists[index] - b.resists[index])
      );
    }

    if (this.affinityHeaders) {
      this.sortFuns = this.sortFuns.concat(
        this.affinityHeaders.map((stat, index) => (a, b) => b.affinities[index] - a.affinities[index])
      );
    }
  }

  getSortFun(sortFunIndex: number): (a: TDemon, b: TDemon) => number {
    return this.sortFuns[sortFunIndex];
  }
}
