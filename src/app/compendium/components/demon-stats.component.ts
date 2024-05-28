import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import Translations from '../data/translations.json';

@Component({
  selector: 'app-demon-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container>
      <h2 *ngIf="title.includes('Lvl')">{{ title }}</h2>
      <table class="entry-table">
        <thead>
          <tr>
            <th [attr.colSpan]="stats.length + fusionHeaders.length + (inherits ? 1 : 0) + (price ? 1 : 0)" class="title">
              {{ title.includes('Lvl') ? (msgs.Stats | translateComp:lang) : title }}
            </th>
          </tr>
          <tr>
            <th *ngIf="price">{{ msgs.Price | translateComp:lang }}</th>
            <th *ngFor="let stat of statHeaders">{{ stat }}</th>
            <th *ngIf="inherits">Inherits</th>
            <th *ngFor="let fusion of fusionHeaders">{{ fusion }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td *ngIf="price">{{ price }}</td>
            <td *ngFor="let stat of stats">{{ stat }}</td>
            <td *ngIf="inherits"><div class="element-icon i{{ inherits }}">{{ inherits }}</div></td>
            <ng-content></ng-content>
          </tr>
        </tbody>
      </table>
    <ng-container>
  `
})
export class DemonStatsComponent {
  @Input() title = 'Demon Entry';
  @Input() statHeaders: string[] = [];
  @Input() stats: number[] = [];
  @Input() fusionHeaders: string[] = [];
  @Input() inherits: number;
  @Input() price = 0;
  @Input() lang = 'en';
  msgs = Translations.DemonStatsComponent;
}
