import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import Translations from '../data/translations.json';
import { TranslateCompPipe } from '../pipes';

@Component({
  selector: 'app-demon-stats',
  imports: [CommonModule, TranslateCompPipe],
  template: `
    <ng-container>
      @if (title.includes('Lvl')) { <h2>{{ title }}</h2> }
      <table class="entry-table">
        <thead>
          <tr>
            <th [attr.colSpan]="stats.length + fusionHeaders.length + (inherits ? 1 : 0) + (price ? 1 : 0)" class="title">
              {{ title.includes('Lvl') ? (msgs.Stats | translateComp:lang) : title }}
            </th>
          </tr>
          <tr>
            @if (price) { <th>{{ msgs.Price | translateComp:lang }}</th> }
            @for (stat of statHeaders; track $index) { <th>{{ stat }}</th> }
            @if (inherits) { <th>Inherits</th> }
            @for (fusion of fusionHeaders; track $index) { <th>{{ fusion }}</th> }
          </tr>
        </thead>
        <tbody>
          <tr>
            @if (price) { <td [attr.rowSpan]="growths.length">{{ inGameCurrencySymbol + (price | number:'1.0-0') }}</td> }
            @for (stat of stats; track $index) { <td>{{ stat }}</td> }
            @if (inherits) { <td [attr.rowSpan]="growths.length"><div class="element-icon inherit-icon i{{ inherits }}">{{ inherits }}</div></td> }
            <ng-content></ng-content>
          </tr>
          @if (growths.length) {
            <tr>
              @for (growth of growths; track $index) { <td>{{ growth }}%</td> }
            </tr>
          }
        </tbody>
      </table>
    </ng-container>
  `,
})
export class DemonStatsComponent {
  @Input() title = 'Demon Entry';
  @Input() statHeaders: string[] = [];
  @Input() stats: number[] = [];
  @Input() growths: number[] = [];
  @Input() fusionHeaders: string[] = [];
  @Input() inherits: number;
  @Input() price = 0;
  @Input() lang = 'en';
  @Input() inGameCurrencySymbol: string;
  msgs = Translations.DemonStatsComponent;
}
