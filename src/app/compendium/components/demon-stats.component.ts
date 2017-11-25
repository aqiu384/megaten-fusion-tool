import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-demon-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table>
      <thead>
        <tr>
          <th [attr.colSpan]="stats.length + fusionHeaders.length + (inherit ? 1 : 0) + (price ? 1 : 0)">
            {{ title }}
          </th>
        </tr>
        <tr>
          <th *ngIf="price">Price</th>
          <th *ngFor="let stat of statHeaders">{{ stat }}</th>
          <th *ngIf="inherit">Inherits</th>
          <th *ngFor="let fusion of fusionHeaders">{{ fusion }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td *ngIf="price">{{ price }}</td>
          <td *ngFor="let stat of stats">{{ stat }}</td>
          <td *ngIf="inherit"><div class="element-icon {{ inherit }}">{{ inherit }}</div></td>
          <ng-content></ng-content>
        </tr>
      </tbody>
    </table>
  `
})
export class DemonStatsComponent {
  @Input() title = 'Demon Entry';
  @Input() statHeaders: string[] = [];
  @Input() stats: number[] = [];
  @Input() fusionHeaders: string[] = [];
  @Input() inherit: string;
  @Input() price = 0;
}
