import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MultiFusionPair } from '../models';

@Component({
  selector: 'app-fusion-multi-pair-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="entry-table">
      <thead>
        <tr><th colspan=5 class="title">{{ leftHeader }} 1 x {{ rightHeader }} 2 = {{ resultName }}</th></tr>
        <tr><th rowspan=2>Price</th><th colspan=3>{{ leftHeader }} 1</th><th>{{ rightHeader }} 2</th></tr>
        <tr><th>Names</th><th>MinLvl</th><th>MaxLvl</th><th>Names</th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of rowData">
          <td>{{ row.price }}</td>
          <td>
            <ul class="comma-list">
              <li *ngFor="let name of row.names1"><a routerLink="../{{ name }}">{{ name }} </a></li>
            </ul>
          </td>
          <td>{{ row.lvl1 }}</td>
          <td>{{ row.lvl2 }}</td>
          <td>
            <ul *ngIf="leftHeader === rightHeader" class="comma-list">
              <li *ngFor="let name of row.names2"><a routerLink="../{{ name }}">{{ name }} </a></li>
            </ul>
            <ul *ngIf="leftHeader !== rightHeader" class="comma-list">
              <li *ngFor="let name of row.names2">{{ name }} </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  `
})
export class FusionMultiPairTableComponent {
  @Input() leftHeader = 'Ingredient';
  @Input() rightHeader = 'Ingredient';
  @Input() resultName = 'Result';
  @Input() rowData: MultiFusionPair[];
}
