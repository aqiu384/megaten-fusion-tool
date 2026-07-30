import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReslvlToColorPipe, ReslvlToStringLocalePipe, ReslvlToStringPipe, ResmodToStringPipe, TranslateCompPipe, TranslateElementLabelPipe } from '../pipes';
import Translations from '../data/translations.json';

@Component({
  selector: 'app-demon-resists',
  imports: [
    CommonModule,
    ReslvlToColorPipe, ReslvlToStringLocalePipe, ReslvlToStringPipe,
    ResmodToStringPipe, TranslateCompPipe, TranslateElementLabelPipe
  ],
  template: `
    @if (resistHeaders.length) {
      <table class="entry-table">
        <thead>
          <tr><th [attr.colspan]="resistHeaders.length + ailmentHeaders.length" class="title">{{ title || (msgs.Resistances | translateComp:lang) }}</th></tr>
          <tr>
            <th [attr.colSpan]="resistHeaders.length">{{ msgs.Element | translateComp:lang }}</th>
            @if (ailmentHeaders.length) {
              <th [attr.colSpan]="ailmentHeaders.length">{{ msgs.Ailment | translateComp:lang }}</th>
            }
          </tr>
          <tr>
            @for (element of resistHeaders; track $index) {
              <th
                [style.width.%]="(ailmentHeaders.length ? 50 : 100) / resistHeaders.length">
                <div [title]="element | translateElementLabel:lang" [ngClass]="['element-icon', element]">{{ element }}</div>
              </th>
            }
            @for (ailment of ailmentHeaders; track $index) {
              <th
                [style.width.%]="50 / ailmentHeaders.length">
                <div [title]="ailment | translateElementLabel:lang" [ngClass]="['ailment-icon', ailment]">{{ ailment }}</div>
              </th>
            }
          </tr>
        </thead>
        <tbody>
          <tr>
            @for (resist of resists; track $index) {
              <td [ngClass]="['resists', resist | reslvlToColor]">
                {{ resist | reslvlToStringLocale:lang }}
              </td>
            }
            @for (resist of ailments; track $index) {
              <td [ngClass]="['resists', resist | reslvlToString]">
                {{ resist | reslvlToStringLocale:lang }}
              </td>
            }
          </tr>
          <tr>
            @for (resist of resists; track $index) {
              <td [ngClass]="['resists', resist % 1024 === 40 ? 'no' : '']">
                {{ resist | resmodToString }}
              </td>
            }
            @for (resist of ailments; track $index) {
              <td [ngClass]="['resists', resist % 1024 === 40 ? 'no' : '']">
                {{ resist | resmodToString }}
              </td>
            }
          </tr>
        </tbody>
      </table>
    }
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
