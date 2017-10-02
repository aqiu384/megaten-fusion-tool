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
          <th colspan="8"><ng-content></ng-content></th>
        </tr>
        <tr>
          <th>Element</th>
          <th>Name</th>
          <th>Cost</th>
          <th>Effect</th>
          <th>Power</th>
          <th>Accuracy</th>
          <th>Inherit</th>
          <th>Rank</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of compendium.getSkills(skills)">
          <td><div class="element-icon {{ data.element }}">{{ data.element }}</div></td>
          <td>{{ data.name }}</td>
          <td [style.color]="data.cost ? null: 'transparent'">{{ data.cost }}</td>
          <td>{{ data.effect }}</td>
          <td [style.color]="data.power ? null: 'transparent'">{{ data.power }}</td>
          <td [style.color]="data.accuracy ? null: 'transparent'">{{ data.accuracy }}</td>
          <td><div class="element-icon {{ data.inherit }}">{{ data.inherit }}</div></td>
          <td [style.color]="data.rank ? null: 'transparent'">{{ data.rank }}</td>
        </tr>
      </tbody>
    </table>
  `
})
export class DemonSkillsComponent {
  @Input() compendium: Compendium;
  @Input() skills: string[];
}
