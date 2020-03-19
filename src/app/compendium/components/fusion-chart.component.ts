import { Component, ChangeDetectionStrategy, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { FusionChart } from '../models';

@Component({
  selector: 'app-fusion-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table>
      <tbody>
        <tr><th class="title" [attr.colspan]="table[0].length">{{ appName }} - {{ normTitle }}</th></tr>
        <tr><th *ngFor="let race of table[0]">{{ race.slice(0, 4) }}</th></tr>
        <tr *ngFor="let row of table.slice(1, table.length - 1)">
          <th>{{ row[0] }}</th>
          <td *ngFor="let race of row.slice(1, row.length - 1)" [ngClass]="[race.slice(0, 4), race.slice(4, 8)]">{{ race.slice(4, 8) }}</td>
          <th>{{ row[row.length - 1] }}</th>
        </tr>
        <tr><th *ngFor="let race of table[table.length - 1]">{{ race.slice(0, 4) }}</th></tr>
        <tr *ngIf="tripTitle"><th class="title" [attr.colspan]="table[0].length">{{ appName }} - {{ tripTitle }}</th></tr>
      <tbody>
    </table>
  `,
  styles: [`
    table { width: auto; margin: 0 auto; }
    th.title { height: 2em; }
    td.elem { color: lime; }
    td.trip { color: lightgray; }
    td.ra-2 { color: orange; }
    td.ra-1 { color: red; }
    td.ran1 { color: lime; }
    td.ran2 { color: cyan; }
    td.None { color: transparent; }
    td.Sala, td.Flae, td.Ara,  td.Fien { color: red; }
    td.Undi, td.Aqua, td.Nigi, td.Enig { color: cyan; }
    td.Sylp, td.Aero, td.Kusi, td.UMA  { color: lime; }
    td.Gnom, td.Erth, td.Saki, td.Rand { color: orange; }
    td.Empt { background-color: black; color: transparent; }
  `]
})
export class FusionChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() normChart: FusionChart;
  @Input() tripChart: FusionChart;
  @Input() mitaTable: string[][];
  @Input() normTitle = 'Normal Fusions';
  @Input() tripTitle = '';
  @Input() isPersona = false;
  @Input() filterDarks = true;
  @Input() counter: number;

  appName: string;
  subscriptions: Subscription[] = [];
  table: string[][] = [];

  constructor(
    private title2: Title,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.route.parent.data.subscribe(data => {
        this.appName = data.appName || 'Shin Megami Tensei';
        this.title2.setTitle(`Fusion Chart - ${this.appName} Fusion Calculator`);
      }));
  }

  ngOnChanges() {
    if (this.normChart) {
      this.fillFusionChart();
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  fillFusionChart() {
    const noResult = 'None';
    const emResult = 'Empt-';

    const elems = this.normChart.elementDemons;
    let lights = [];
    let norms = this.normChart.races;
    let darks = [];

    if (this.filterDarks) {
      lights = this.normChart.races.filter(race => this.normChart.getLightDark(race) === 1);
      norms = this.normChart.races.filter(race => this.normChart.getLightDark(race) === 0);
      darks = this.normChart.races.filter(race => this.normChart.getLightDark(race) === -1);
    }

    const leftOff = lights.length - darks.length;
    const top = lights.concat(norms, elems);
    const bottom = !darks.length ?
      top : darks.concat(Array(top.length - darks.length).fill(''));
    const right = this.mitaTable ?
      top : lights.concat(norms, Array(elems.length).fill(''));
    const left = !(this.mitaTable || darks.length) ?
      top : Array(leftOff).fill('').concat(darks, norms, elems);

    this.table = [ [''].concat(top, ['']) ];

    for (let r = 0; r < left.length; r++) {
      const row = Array(top.length + 2).fill(emResult);
      const raceL = left[r];
      const raceR = right[r];
      const isElemL = elems.indexOf(raceL) !== -1;
      const isElemR = elems.indexOf(raceR) !== -1;
      this.table.push(row);

      row[0] = raceL;
      row[row.length - 1] = raceR;

      for (let c = r; c < top.length; c++) {
        const raceT = top[c];
        const isElemT = elems.indexOf(raceT) !== -1;

        if (isElemT && isElemR) {
          const indexR = elems.indexOf(raceR);
          const indexT = elems.indexOf(raceT);
          const result = this.mitaTable[indexR][indexT - indexR - 1];
          row[c + 1] = 'mita' + (result ? result : noResult);
        } else if (isElemT && raceR) {
          const result = this.normChart.getElemFusions(raceT)[raceR];
          const resstr = result ? result.toString() : '';
          row[c + 1] = result ? (result > 0 ? 'ran' + resstr + '+' : 'ra' + resstr) + resstr : 'rank' + noResult;
        } else if (raceT && raceR) {
          const result = this.isPersona && raceT === raceR ? raceT : this.normChart.getRaceFusion(raceT, raceR);
          row[c + 1] = (raceT === raceR ? 'elem' : 'norm') + (result ? result : noResult);
        }
      }

      if (this.tripChart) {
        for (let c = 0; c <= r - leftOff; c++) {
          const raceB = bottom[c];

          if (raceB && isElemL) {
            const result = this.tripChart.getElemFusions(raceL)[raceB];
            const resstr = result ? result.toString() : '';
            row[c + 1] = result ? (result > 0 ? 'ran' + resstr + '+' : 'ra' + resstr) + resstr: 'rank' + noResult;
          } else if (raceB && raceL) {
            const result = this.tripChart.getRaceFusion(raceB, raceL);
            row[c + 1] = (raceB === raceL ? 'elem' : 'trip') + (result ? result : noResult);
          }
        }
      }

      if (raceL.indexOf(' x ') !== -1) {
        const [ raceA, raceB ] = raceL.split(' x ');
        const raceX = raceA.slice(0, 3) + 'x' + raceB.slice(0, 3);

        row[0] = raceX;
        row[row.length - 1] = raceX;
      } else if (raceL.indexOf(' ') !== -1) {
        const raceX = raceL.split(' ')[0];

        row[0] = raceX;
        row[row.length - 1] = raceX;
      }
    }

    for (let c = 0; c < this.table[0].length; c++) {
      const race = this.table[0][c];

      if (race.indexOf(' x ') !== -1) {
        const [ raceA, raceB ] = race.split(' x ');
        this.table[0][c] = raceA.slice(0, 2) + raceB.slice(0, 2);
      }
    }

    this.table.push([''].concat(bottom, ['']));
  }
}
