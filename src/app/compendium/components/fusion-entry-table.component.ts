import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { FusionEntry } from '../models';

@Component({
  selector: 'app-fusion-entry-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table [ngClass]="isFusion ? 'list-table' : 'entry-table'">
      <thead>
        <tr><th colspan="4" class="title">{{ title }}</th></tr>
        <tr *ngIf="langEn"><th>Price</th><th>Race</th><th>Lvl</th><th>Name</th></tr>
        <tr *ngIf="!langEn"><th>価格</th><th>種族</th><th>Lvl</th><th>悪魔名</th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of rowData">
          <td>{{ data.price }}</td>
          <td>{{ data.race1 }}</td>
          <td>{{ data.lvl1 | lvlToNumber }}</td>
          <td><a routerLink="{{ baseUrl }}/{{ data.name1 }}">{{ data.name1 }}</a></td>
        </tr>
      </tbody>
    </table>
  `
})
export class FusionEntryTableComponent {
  @Input() title = 'Special Fusion Ingredients';
  @Input() baseUrl = '../..';
  @Input() rowData: FusionEntry[];
  @Input() isFusion = false;
  @Input() langEn = true;
}
