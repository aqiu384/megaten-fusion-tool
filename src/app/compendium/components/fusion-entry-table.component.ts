import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { FusionEntry } from '../models';

@Component({
  selector: 'app-fusion-entry-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table>
      <thead>
        <tr>
          <th colspan="3">{{ title }}</th>
        </tr>
        <tr>
          <th>Race</th>
          <th>Lvl</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of rowData">
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
}
