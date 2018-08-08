import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { FusionChart } from '../models/fusion-chart';
import { FusionDataService } from '../fusion-data.service';
import { Arcanas } from '../constants';

@Component({
  selector: 'app-mib-fusion-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="mib-fusion-table">
      <tbody>
        <tr><th class="title" [attr.colspan]="table[0].length">{{ normTitle }}</th></tr>
        <tr><th *ngFor="let race of table[0]">{{ race.slice(0, 4) }}</th></tr>
        <tr *ngFor="let row of table.slice(1, table.length - 1)">
          <th>{{ row[0] }}</th>
          <td *ngFor="let race of row.slice(1, row.length - 1)" [ngClass]="[race.slice(0, 8)]">{{ race.slice(8, 12) }}</td>
          <th>{{ row[row.length - 1] }}</th>
        </tr>
        <tr><th *ngFor="let race of table[table.length - 1]">{{ race.slice(0, 4) }}</th></tr>
      </tbody>
    </table>
    <table class="mib-fusion-table">
      <tbody>
        <tr><th class="title" [attr.colspan]="elemTable[0].length">{{ elemTitle }}</th></tr>
        <tr><th *ngFor="let race of elemTable[0]">{{ race.slice(0, 4) }}</th></tr>
        <tr *ngFor="let row of elemTable.slice(1, elemTable.length - 1)">
          <th>{{ row[0] }}</th>
          <td *ngFor="let race of row.slice(1, row.length - 1)" [ngClass]="[race.slice(0, 4)]">{{ race.slice(4) }}</td>
          <th>{{ row[row.length - 1] }}</th>
        </tr>
        <tr><th *ngFor="let race of elemTable[elemTable.length - 1]">{{ race.slice(0, 4) }}</th></tr>
      </tbody>
    </table>
  `,
  styles: [`
    table { width: auto; margin: 0 auto; }
    th.title { height: 2em; }
    td.ra-2 { color: orange; }
    td.ra-1 { color: red; }
    td.ran1 { color: lime; }
    td.ran2 { color: cyan; }
    td.None, td.emp { color: #222; }
    td.Empt { background-color: black; color: transparent; }
  `]
})
export class MibFusionChartComponent implements OnChanges {
  @Input() normChart: FusionChart;
  @Input() normTitle: string;
  @Input() elemTitle: string;

  table: string[][];
  elemTable: string[][];

  ngOnChanges() {
    if (this.normChart) {
      this.fillFusionChart();
    }
  }

  getColorClass(row: number, col: number): string {
    const color = this.normChart.fuseColors[row].charAt(col);

    if (color === 'B') {
      return 'blu';
    } else if (color === 'R') {
      return 'red';
    } else {
      return 'whi';
    }
  }

  getInheritClass(row: number, col: number): string {
    const inherit = this.normChart.fuseInherits[row].charAt(col);

    if (inherit === '2') {
      return 'sec';
    } else if (inherit === '1') {
      return 'fir';
    } else if (inherit === 'T') {
      return 'unf';
    } else if (inherit === '0') {
      return 'non';
    } else {
      return 'emp';
    }
  }

  fillFusionChart() {
    const noResult = 'None';
    const emResult = 'Empt    -';
    const table: string[][] = [];
    const elemTable: string[][] = [];
    const races = this.normChart.races;
    const elems = this.normChart.elementDemons;
    table.push([''].concat(races, ['']));

    for (let r = 0; r < races.length; r++) {
      const race1 = races[r];
      const row = [races[r]];

      for (let c = 0; c < r; c++) {
        row.push(emResult);
      }

      for (let c = r; c < races.length; c++) {
        const raceR = this.normChart.getRaceFusion(race1, races[c]) || noResult;
        row.push(`${this.getColorClass(r, c)} ${this.getInheritClass(r, c)} ${raceR}`);
      }

      row.push(races[r]);
      table.push(row);
    }

    table.push([''].concat(races, ['']));
    this.table = table;

    elemTable.push([''].concat(Arcanas, ['']));

    for (const elem of elems) {
      const row = [elem];
      const elemRow = this.normChart.getElemFusions(elem);

      for (const race of Arcanas) {
        const rank = (elemRow[race] || noResult).toString();
        const rankStr = rank.length < 2 ? '+' + rank : rank;
        row.push(rankStr.replace('+', 'ran').replace('-', 'ra-') + rankStr);
      }

      row.push(elem);
      elemTable.push(row);
    }

    elemTable.push([''].concat(Arcanas, ['']));
    this.elemTable = elemTable;
  }
}

@Component({
  selector: 'app-fusion-chart-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-mib-fusion-chart
      [normChart]="normChart"
      [normTitle]="appName + ' - Normal Fusions'"
      [elemTitle]="appName + ' - Gem Fusions'">
    </app-mib-fusion-chart>
  `
})
export class FusionChartContainerComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  normChart: FusionChart;
  appName: string;

  constructor(
    private title2: Title,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private fusionDataService: FusionDataService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.route.parent.data.subscribe(data => {
        this.appName = data.appName;
        this.title2.setTitle(`Fusion Chart - ${data.appName}`);
      }));

    this.subscriptions.push(
      this.fusionDataService.fusionChart.subscribe(fusionChart => {
        this.changeDetectorRef.markForCheck();
        this.normChart = fusionChart;
      }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
