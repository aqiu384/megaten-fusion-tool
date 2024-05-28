import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import Translations from '../data/translations.json';

@Component({
  selector: 'app-demon-resists',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table *ngIf="resistHeaders.length" class="entry-table">
      <thead>
        <tr><th [attr.colspan]="resistHeaders.length + ailmentHeaders.length" class="title">{{ title || (msgs.Resistances | translateComp:lang) }}</th></tr>
        <tr>
          <th [attr.colSpan]="resistHeaders.length">{{ msgs.Element | translateComp:lang }}</th>
          <th *ngIf="ailmentHeaders.length" [attr.colSpan]="ailmentHeaders.length">{{ msgs.Ailment | translateComp:lang }}</th>
        </tr>
        <tr>
          <th *ngFor="let element of resistHeaders"
            [style.width.%]="(ailmentHeaders.length ? 50 : 100) / resistHeaders.length">
            <div [ngClass]="['element-icon', element]">{{ element }}</div>
          </th>
          <th *ngFor="let ailment of ailmentHeaders"
            [style.width.%]="50 / ailmentHeaders.length">
            <div>{{ ailment }}</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td *ngFor="let resist of resists" [ngClass]="['resists', resist | reslvlToColor]">
            {{ resist | reslvlToStringJa:lang }}
          </td>
          <td *ngFor="let resist of ailments" [ngClass]="['resists', resist | reslvlToString]">
            {{ resist | reslvlToStringJa:lang }}
          </td>
        </tr>
        <tr>
          <td *ngFor="let resist of resists" [ngClass]="['resists', resist % 1024 === 40 ? 'no' : '']">
            {{ resist | resmodToString }}
          </td>
          <td *ngFor="let resist of ailments" [ngClass]="['resists', resist % 1024 === 40 ? 'no' : '']">
            {{ resist | resmodToString }}
          </td>
        </tr>
      </tbody>
    </table>
  `
})
export class DemonResistsComponent {
  @Input() title = '';
  @Input() resistHeaders: string[] = [];
  @Input() resists: number[] = [];
  @Input() ailmentHeaders: string[] = [];
  @Input() ailments: number[] = [];
  @Input() lang = 'en';
  msgs = Translations.DemonResistsComponent;
}
