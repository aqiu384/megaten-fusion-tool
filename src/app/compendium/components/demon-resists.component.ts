import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-demon-resists',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table *ngIf="resistHeaders.length">
      <thead>
        <tr><th [attr.colspan]="resists.length + ailments.length">Resistances</th></tr>
        <tr>
          <th [attr.colSpan]="resists.length" [style.width.%]="50">Element</th>
          <th *ngIf="ailmentHeaders.length" [attr.colSpan]="ailments.length" [style.width.%]="50">Ailment</th>
        </tr>
        <tr>
          <th *ngFor="let element of resistHeaders">
            <div class="element-icon {{ element }}">{{ element }}</div>
          </th>
          <th *ngFor="let ailment of ailmentHeaders">
            <div>{{ ailment }}</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <ng-container *ngFor="let lvls of [ resists, ailments ]">
            <td *ngFor="let resist of lvls" class="resists {{ resist }}">{{ resist }}</td>
          </ng-container>
        </tr>
      </tbody>
    </table>
  `
})
export class DemonResistsComponent {
  @Input() resistHeaders: string[] = [];
  @Input() resists: string[] = [];
  @Input() ailmentHeaders: string[] = [];
  @Input() ailments: string[] = [];
}
