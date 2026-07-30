import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FusionEntry } from '../models';
import { LvlToNumberPipe, TranslateCompPipe } from '../pipes';
import Translations from '../data/translations.json';

@Component({
  selector: 'app-fusion-entry-table',
  imports: [CommonModule, RouterModule, LvlToNumberPipe, TranslateCompPipe],
  template: `
    <table [ngClass]="isFusion ? 'list-table' : 'entry-table'">
      <thead>
        <tr><th colspan="4" class="title">{{ title }}</th></tr>
        <tr>
          <th>{{ msgs.Price | translateComp:lang }}</th>
          <th>{{ msgs.Race | translateComp:lang }}</th>
          <th>Lvl</th>
          <th>{{ msgs.Name | translateComp:lang }}</th>
        </tr>
      </thead>
      <tbody>
        @for (data of rowData; track data) {
          <tr>
            <td>{{ inGameCurrencySymbol + (data.price | number:'1.0-0') }}</td>
            <td>{{ data.race1 }}</td>
            <td>{{ data.lvl1 | lvlToNumber }}</td>
            <td><a routerLink="{{ baseUrl }}/{{ data.name1 }}">{{ data.name1 }}</a></td>
          </tr>
        }
      </tbody>
    </table>
  `
})
export class FusionEntryTableComponent {
  @Input() title = 'Special Fusion Ingredients';
  @Input() baseUrl = '../..';
  @Input() rowData: FusionEntry[];
  @Input() isFusion = false;
  @Input() lang = 'en';
  @Input() inGameCurrencySymbol: string;
  msgs = Translations.FusionPairTableComponent;
}
