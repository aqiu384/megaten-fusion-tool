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
            <td *ngIf="price" [attr.rowSpan]="growths.length">{{ price.toLocaleString() }}</td>
            <td *ngFor="let stat of stats">{{ stat }}</td>
            <td *ngIf="inherits" [attr.rowSpan]="growths.length"><div [title]="((inheritLabels[inheritanceLabelMap[inherits]] ?? []) | translateComp: lang)|| inheritanceLabelMap[inherits]" class="element-icon i{{ inherits }}">{{ inherits }}</div></td>
            <ng-content></ng-content>
          </tr>
          <tr *ngIf="growths.length">
            <td *ngFor="let growth of growths">{{ growth }}%</td>
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
  @Input() growths: number[] = [];
  @Input() fusionHeaders: string[] = [];
  @Input() inherits: number;
  @Input() inheritanceLabelMap: {} = {};
  @Input() price : Number= 0;
  @Input() lang = 'en';
  msgs = Translations.DemonStatsComponent;
  inheritLabels = Translations.InheritanceTypeLabels;

}
