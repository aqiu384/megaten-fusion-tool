import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MultiFusionPair } from '../models';

@Component({
  selector: 'app-fusion-multi-pair-table',
  imports: [RouterModule],
  template: `
    <table class="entry-table">
      <thead>
        <tr><th colspan=5 class="title">{{ leftHeader }} 1 x {{ rightHeader }} 2 = {{ resultName }}</th></tr>
        <tr><th rowspan=2>Price</th><th colspan=3>{{ leftHeader }} 1</th><th>{{ rightHeader }} 2</th></tr>
        <tr><th>Names</th><th>MinLvl</th><th>MaxLvl</th><th>Names</th></tr>
      </thead>
      <tbody>
        @for (row of rowData; track row) {
          <tr>
            <td>{{ row.price }}</td>
            <td>
              <ul class="comma-list">
                @for (name of row.names1; track name) { <li><a routerLink="../{{ name }}">{{ name }} </a></li> }
              </ul>
            </td>
            <td>{{ row.lvl1 }}</td>
            <td>{{ row.lvl2 }}</td>
            <td>
              @if (leftHeader === rightHeader) {
                <ul class="comma-list">
                  @for (name of row.names2; track name) { <li><a routerLink="../{{ name }}">{{ name }} </a></li> }
                </ul>
              }
              @if (leftHeader !== rightHeader) {
                <ul class="comma-list">
                  @for (name of row.names2; track name) { <li>{{ name }} </li> }
                </ul>
              }
            </td>
          </tr>
        }
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
