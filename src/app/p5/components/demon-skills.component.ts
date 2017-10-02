import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges
} from '@angular/core';

import { ElementOrder } from '../models/constants';
import { Skill } from '../models';
import { Compendium } from '../models/compendium';

@Component({
  selector: 'app-demon-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table>
      <thead>
        <tr>
          <th colspan="5">Learned Skills</th>
        </tr>
        <tr>
          <th>Element</th>
          <th>Name</th>
          <th>Cost</th>
          <th>Effect</th>
          <th>Level</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of skills" [ngClass]="{ unique: data.unique }">
          <td><div class="element-icon {{ data.element }}">{{ data.element }}</div></td>
          <td>{{ data.name }}</td>
          <td>{{ data.cost | skillCostToString }}</td>
          <td>{{ data.effect }}</td>
          <td>{{ data.level | skillLevelToString }}</td>
        </tr>
      </tbody>
    </table>
  `
})
export class DemonSkillsComponent implements OnChanges {
  @Input() compendium: Compendium;
  @Input() skillLevels: { [id: string]: number };
  skills: Skill[];

  static SKILL_CMP(a: Skill, b: Skill): number {
    return (a.level - b.level) * 20 + ElementOrder[a.element] - ElementOrder[b.element];
  }

  ngOnChanges(): void {
    this.skills = Object.keys(this.skillLevels).map(name => this.compendium.getSkill(name));
    for (const skill of this.skills) {
      skill.level = this.skillLevels[skill.name];
    }
    this.skills.sort(DemonSkillsComponent.SKILL_CMP);
  }
}
