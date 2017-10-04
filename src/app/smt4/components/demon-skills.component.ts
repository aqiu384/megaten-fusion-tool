import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Skill } from '../models';
import { Compendium } from '../models/compendium';

@Component({
  selector: 'app-demon-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table>
      <thead>
        <tr>
          <th colspan="7">Learned Skills</th>
        </tr>
        <tr>
          <th>Element</th>
          <th>Name</th>
          <th>Cost</th>
          <th>Effect</th>
          <th>Target</th>
          <th>Rank</th>
          <th>Level</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of compendium.getSkills(skills)"
          [ngClass]="{ unique: data.rank === 99 }">
          <td><div class="element-icon {{ data.element }}">{{ data.element }}</div></td>
          <td>{{ data.name }}</td>
          <td [style.color]="data.cost ? null: 'transparent'">{{ data.cost }}</td>
          <td *ngIf="data.damage">
            {{ data.damage }}
            {{ data.element }}
            damage{{ data.hits ? ' x' + data.hits : '' }}{{ data.effect ? ', ' + data.effect : '' }}
          </td>
          <td *ngIf="!data.damage">{{ data.effect }}</td>
          <td>{{ data.target ? data.target : 'Self' }}</td>
          <td [style.color]="data.rank !== 99 ? null: 'transparent'">{{ data.rank }}</td>
          <td>{{ data.level | skillLevelToString }}</td>
        </tr>
      </tbody>
    </table>
  `
})
export class DemonSkillsComponent {
  @Input() compendium: Compendium;
  @Input() skills: { [skill: string]: number };
}
