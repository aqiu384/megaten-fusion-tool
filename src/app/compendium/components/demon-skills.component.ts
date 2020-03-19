import { Component, ChangeDetectionStrategy, Input, OnInit, OnChanges } from '@angular/core';
import { Compendium, Skill } from '../models';

@Component({
  selector: 'app-demon-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table>
      <thead>
        <tr>
          <th [attr.colSpan]="skillHeaderLen">{{ title }}</th>
        </tr>
        <tr>
          <th>Element</th>
          <th>Name</th>
          <th>Cost</th>
          <th>Effect</th>
          <th *ngIf="hasTarget">Target</th>
          <th *ngIf="hasRank">Rank</th>
          <th *ngIf="hasInherit">Inherit</th>
          <th *ngIf="hasLvl">Level</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of skills"
          class="app-smt-skill-list-row"
          [hasTarget]="hasTarget"
          [hasRank]="hasRank"
          [hasInherit]="hasInherit"
          [hasLearned]="false"
          [hasLvl]="hasLvl"
          [data]="data"
          [ngClass]="{
            extra: data.rank > 70 && data.rank < 90,
            unique: data.rank > 90
          }">
        </tr>
        <tr *ngIf="!skills.length">
          <td [attr.colspan]="skillHeaderLen">No {{ title }} Found</td>
        <tr>
      </tbody>
    </table>
  `
})
export class DemonSkillsComponent implements OnInit, OnChanges {
  @Input() title = 'Learned Skills';
  @Input() hasInherit = false;
  @Input() hasTarget = false;
  @Input() hasRank = false;
  @Input() hasLvl = true;
  @Input() compendium: Compendium;
  @Input() elemOrder: { [elem: string]: number };
  @Input() skillLevels: { [id: string]: number };
  skills: Skill[];
  skillHeaderLen = 5;

  ngOnInit() {
    this.nextColIndices();
  }

  ngOnChanges() {
    this.nextSkills();
  }

  protected nextColIndices() {
    if (this.hasInherit) {
      this.skillHeaderLen += 1;
    } if (this.hasTarget) {
      this.skillHeaderLen += 1;
    } if (this.hasRank) {
      this.skillHeaderLen += 1;
    }
  }

  protected nextSkills() {
    this.skills = Object.keys(this.skillLevels).map(name => this.compendium.getSkill(name));

    for (const skill of this.skills) {
      skill.level = this.skillLevels[skill.name];
    }

    if (this.elemOrder) {
      this.skills.sort((a, b) =>
        (a.level - b.level) * 20 +
        this.elemOrder[a.element] - this.elemOrder[b.element]
      );
    }
  }
}
