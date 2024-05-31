import { Component, ChangeDetectionStrategy, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { FusionChart } from '../models';
import { translateComp } from '../models/translator';
import Translations from '../data/translations.json'

@Component({
  selector: 'app-fusion-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table>
      <tbody>
        <tr><th class="title" [attr.colspan]="table[0].length">{{ appName }} {{ normTitle }}</th></tr>
        <tr><th *ngFor="let race of table[0]">{{ race.slice(0, nameCut) }}</th></tr>
        <tr *ngFor="let row of table.slice(1, table.length - 1)">
          <th>{{ row[0] }}</th>
          <td *ngFor="let race of row.slice(1, row.length - 1)" [ngClass]="race.slice(0, 4)">{{ race.slice(4, nameCut + 4) }}</td>
          <th>{{ row[row.length - 1] }}</th>
        </tr>
        <tr><th *ngFor="let race of table[table.length - 1]">{{ race.slice(0, nameCut) }}</th></tr>
        <tr *ngIf="tripTitle"><th class="title" [attr.colspan]="table[0].length">{{ appName }} {{ tripTitle }}</th></tr>
      <tbody>
    </table>
  `,
  styles: [`
    table { width: auto; margin: 0 auto; white-space: nowrap; }
    td.elem { color: lime; }
    td.trip { color: lightgray; }
    td.oran { color: orange; }
    td.redd { color: red; }
    td.gree { color: lime; }
    td.blue { color: cyan; }
    td.none { color: transparent; }
    td.empt { background-color: transparent; color: transparent; }
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
  @Input() lang = 'en';
  @Input() counter: number;
  msgs = Translations.FusionChartComponent;

  static readonly RESULT_COLORS = Object.entries({
    'oran': ['-2', 'Erthys', 'Gnome', 'Saki', 'Saki Mitama', 'Random', 'アーシーズ', 'ノーム', 'サキミタマ'],
    'redd': ['-1', 'Flaemis', 'Salamander', 'Ara ', 'Ara Mitama', 'Fiend', 'フレイミーズ', 'サラマンダー', 'アラミタマ'],
    'gree': ['1', 'Aeros', 'Sylph', 'Kusi', 'Kusi Mitama', 'UMA', 'エアロス', 'シルキー', 'クシミタマ'],
    'blue': ['2', 'Aquans', 'Undine', 'Nigi', 'Nigi Mitama', 'Enigma', 'アクアンズ', 'ウンディーネ', 'ニギミタマ']
  });

  appName: string;
  subscriptions: Subscription[] = [];
  table: string[][] = [];
  nameCut = 4;

  constructor(
    private title2: Title,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.route.parent.data.subscribe(data => {
        this.appName = data.appName || 'Shin Megami Tensei';
        this.nameCut = parseInt(translateComp(this.msgs.NameCut, data.lang));
        this.title2.setTitle(translateComp(this.msgs.AppTitle, data.lang).replace('$APP', this.appName));
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
    const noResult = 'noneNone';
    const emResult = 'empt-';
    const colorLook = FusionChartComponent.RESULT_COLORS
      .reduce((acc, [color, results]) => results.reduce((row, res) => { row[res] = color; return row }, acc), {});

    const elems = this.normChart.elementDemons;
    let lights = [];
    let norms = this.normChart.races;
    let darks = [];

    if (this.filterDarks) {
      lights = this.normChart.races.filter(race => this.normChart.getLightDark(race) > 0);
      norms = this.normChart.races.filter(race => this.normChart.getLightDark(race) === 0);
      darks = this.normChart.races.filter(race => this.normChart.getLightDark(race) === -1);

      if (darks.length === 0 && lights.length > 0) {
        lights = this.normChart.races.filter(race => this.normChart.getLightDark(race) > -1);
        norms = [];
        darks = this.normChart.races.filter(race => this.normChart.getLightDark(race) < -1);
      }
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
          row[c + 1] = result ? (colorLook[result] || 'norm') + result : noResult;
        } else if (isElemT && raceR) {
          const result = this.normChart.getElemFusions(raceT)[raceR];
          row[c + 1] = result ? (colorLook[result] || 'rank') + (result > 0 ? '+' : '') + result.toString() : noResult;
        } else if (raceT && raceR) {
          const result = this.isPersona && raceT === raceR ? raceT : this.normChart.getRaceFusion(raceT, raceR);
          row[c + 1] = result ? (colorLook[result] || (raceT === raceR ? 'elem' : 'norm')) + result : noResult;
        }
      }

      if (this.tripChart) {
        for (let c = 0; c <= r - leftOff; c++) {
          const raceB = bottom[c];

          if (raceB && isElemL) {
            const result = this.tripChart.getElemFusions(raceL)[raceB];
            row[c + 1] = result ? (colorLook[result] || 'rank') + (result > 0 ? '+' : '') + result.toString() : noResult;
          } else if (raceB && raceL) {
            const result = this.tripChart.getRaceFusion(raceB, raceL);
            row[c + 1] = result ? (colorLook[result] || (raceB === raceL ? 'elem' : 'trip')) + result : noResult;
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
