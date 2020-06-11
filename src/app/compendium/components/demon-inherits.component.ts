import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-demon-inherits',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table>
      <thead>
        <tr>
          <th *ngIf="!hasLvls" [attr.colspan]="inheritHeaders.length">Inheritable Skills</th>
          <th *ngIf="hasLvls && inheritHeaders.length" [attr.colspan]="inheritHeaders.length">Skill Affinities</th>
        </tr>
        <tr>
          <th *ngFor="let element of inheritHeaders" [style.width.%]="100 / inheritHeaders.length">
            <ng-container *ngIf="!hasIcons">{{ element }}</ng-container>
            <div *ngIf="hasIcons" class="element-icon {{ element }}">{{ element }}</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr *ngIf="!hasLvls && !hasChance">
          <td *ngFor="let inherit of inherits" [style.color]="inherit ? null : 'transparent'">
            {{ inherit ? 'yes' : 'no' }}
          </td>
        </tr>
        <tr *ngIf="hasChance">
          <td *ngFor="let affinity of inherits" class="affinity{{ affinity * 100 | roundInheritPercent }}">
            {{ affinity * 100 }}%
          </td>
        </tr>
        <tr *ngIf="hasLvls">
          <td *ngFor="let affinity of inherits" class="affinity{{ affinity }}">
            {{ affinity | affinityToString }}
          </td>
        </tr>
      </tbody>
    </table>
  `
})
export class DemonInheritsComponent {
  @Input() inheritHeaders: string[] = [];
  @Input() inherits: number[] = [];
  @Input() hasChance = false;
  @Input() hasIcons = true;
  @Input() hasLvls = false;
}
