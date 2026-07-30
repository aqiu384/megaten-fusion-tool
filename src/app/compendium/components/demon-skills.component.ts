import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Compendium, Skill } from '../models';
import { SmtSkillListRowComponent } from './smt-skill-list.component';
import { TranslateCompPipe } from '../pipes';
import Translations from '../data/translations.json';

@Component({
  selector: 'app-demon-skills',
  imports: [CommonModule, SmtSkillListRowComponent, TranslateCompPipe],
  template: `
    <table class="entry-table">
      <thead>
        <tr>
          <th [attr.colSpan]="skillHeaderLen" class="title">{{ title }}</th>
        </tr>
        <tr>
          <th>{{ msgs.Elem | translateComp:lang }}</th>
          <th>{{ msgs.Name | translateComp:lang }}</th>
          <th>{{ msgs.Cost | translateComp:lang }}</th>
          <th>{{ msgs.Effect | translateComp:lang }}</th>
          @if (hasTarget)  { <th>{{ msgs.Target| translateComp:lang }}</th> }
          @if (hasRank)    { <th>{{ msgs.Rank | translateComp:lang }}</th> }
          @if (hasInherit) { <th>Inherit</th> }
          @if (hasLvl)     { <th>Lvl</th> }
        </tr>
      </thead>
      <tbody>
        @for (data of skills; track $index) {
          <tr class="app-smt-skill-list-row"
            [hasTarget]="hasTarget"
            [hasRank]="hasRank"
            [hasInherit]="hasInherit"
            [hasLearned]="false"
            [hasLvl]="hasLvl"
            [skillLvl]="data.level"
            [data]="data"
            [ngClass]="{
              extra: data.rank > 70 && data.rank < 90,
              unique: data.rank > 90
            }">
          </tr>
        }
        @if (!skills.length) {
          <tr>
            <td [attr.colspan]="skillHeaderLen">No {{ title }} Found</td>
          <tr>
        }
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
  @Input() lang = 'en';
  skills: Skill[];
  skillHeaderLen = 5;
  msgs = Translations.SkillListComponent;

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
        (a.level - b.level) * 200 +
        this.elemOrder[a.element] - this.elemOrder[b.element]
      );
    }
  }
}
