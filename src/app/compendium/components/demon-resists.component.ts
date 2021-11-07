import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ResistanceLevels } from '../constants';

@Component({
  selector: 'app-demon-resists',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table *ngIf="resistHeaders.length" class="entry-table">
      <thead>
        <tr><th [attr.colspan]="resistHeaders.length + ailmentHeaders.length" class="title">{{ langEn ? title : '耐性' }}</th></tr>
        <tr>
          <th [attr.colSpan]="resistHeaders.length">{{ langEn ? 'Element' : '属性' }}</th>
          <th *ngIf="ailmentHeaders.length" [attr.colSpan]="ailmentHeaders.length">{{ langEn ? 'Ailment' : '状態異常' }}</th>
        </tr>
        <tr>
          <th *ngFor="let element of resistHeaders"
            [style.width.%]="(ailmentHeaders.length ? 50 : 100) / resistHeaders.length">
            <div class="element-icon {{ element }}">{{ element }}</div>
          </th>
          <th *ngFor="let ailment of ailmentHeaders"
            [style.width.%]="50 / ailmentHeaders.length">
            <div>{{ ailment }}</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <ng-container *ngIf="langEn">
            <td *ngFor="let resist of resists" class="resists {{ resist | reslvlToString }}">
              {{ resist | reslvlToString }}
            </td>
            <td *ngFor="let resist of ailments" class="resists {{ resist | reslvlToString }}">
              {{ resist | reslvlToString }}
            </td>
          </ng-container>
          <ng-container *ngIf="!langEn">
            <td *ngFor="let resist of resists" class="resists {{ resist | reslvlToString }}">
              {{ resist | reslvlToStringJa }}
            </td>
            <td *ngFor="let resist of ailments" class="resists {{ resist | reslvlToString }}">
              {{ resist | reslvlToStringJa }}
            </td>
          </ng-container>
        </tr>
      </tbody>
    </table>
  `
})
export class DemonResistsComponent {
  @Input() title = 'Resistances';
  @Input() resistHeaders: string[] = [];
  @Input() resists: number[] = [];
  @Input() ailmentHeaders: string[] = [];
  @Input() ailments: number[] = [];
  @Input() langEn = true;
}
