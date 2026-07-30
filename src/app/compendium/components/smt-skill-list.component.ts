import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PositionEdgesService } from '../../shared/position-edges.service';
import { SkillListComponent } from '../../compendium/bases/skill-list.component';
import { Skill } from '../models';
import { SkillCostToStringPipe, SkillLevelToShortStringPipeLocale, SkillLevelToStringPipe, TranslateElementLabelPipe } from '../pipes';
import { SkillListHeaderComponent } from './skill-list-header.component';
import { PositionStickyDirective } from '../../shared/position-sticky.directive';
import { ColumnWidthsDirective } from '../../shared/column-widths.directive';

@Component({
  selector: 'tr.app-smt-skill-list-row',
  imports: [
    CommonModule, RouterModule,
    SkillCostToStringPipe, SkillLevelToShortStringPipeLocale, SkillLevelToStringPipe, TranslateElementLabelPipe
  ],
  template: `
    <td><div [title]="data.element | translateElementLabel:lang" class="element-icon {{ data.element }}">{{ data.element }}</div></td>
    <td>{{ data.name }}</td>
    <td [style.color]="data.cost ? null: 'transparent'">{{ data.cost | skillCostToString }}</td>
    @if (data.damage) {
      <td>
        {{ data.damage }}
        {{ data.element }}
        damage{{ data.hits ? ' x' + data.hits : '' }}{{ data.effect ? ', ' + data.effect : '' }}
      </td>
    }
    @if (!data.damage) { <td>{{ data.effect }}</td> }
    @if (hasTarget)    { <td><div class="target-icon a{{ data.target || 'Self' }}">{{ data.target || 'Self' }}</div></td> }
    @if (hasRank)      { <td [style.color]="data.rank !== 99 ? null: 'transparent'">{{ data.rank }}</td> }
    @if (hasInherit)   { <td><div class="element-icon {{ data.inherit }}">{{ data.inherit }}</div></td> }
    @if (hasLvl)       { <td [ngClass]="'lvl' + data.level.toString()">{{ data.level | skillLevelToString }}</td> }
    @if (hasLearned) {
      <td>
        <ul class="comma-list">
          @for (entry of data.learnedBy; track entry) {
            <li>
              <a routerLink="../{{ isPersona ? 'personas' : 'demons' }}/{{ entry.demon }}">{{ entry.demon }}</a>
              {{ entry.level | skillLevelToShortStringLocale:lang }}
            </li>
          }
        </ul>
      </td>
    }
    @if (hasTransferTitle) {
      <td>
        <ul class="comma-list">
          @for (entry of data.transfer; track entry) {
            <li>
              @if (entry.level >= -99) {
                <a routerLink="../{{ hasSkillCards ? 'personas' : 'demons' }}/{{ entry.demon }}">{{ entry.demon }}</a>
                {{ entry.level | skillLevelToShortStringLocale:lang }}
              }
              @if (entry.level < -99) {
                {{ entry.demon }}
              }
            </li>
          }
        </ul>
      </td>
    }
  `
})
export class SmtSkillListRowComponent {
  @Input() hasInherit = false;
  @Input() hasTarget = true;
  @Input() hasRank = true;
  @Input() hasLearned = true;
  @Input() hasLvl = false;
  @Input() isPersona = false;
  @Input() hasTransferTitle = false;
  @Input() hasSkillCards = false;
  @Input() skillLvl = -1;
  @Input() lang = 'en';
  @Input() data: Skill;
}

@Component({
  selector: 'app-smt-skill-list',
  imports: [
    CommonModule,
    ColumnWidthsDirective, PositionStickyDirective,
    SkillListHeaderComponent, SmtSkillListRowComponent
  ],
  providers: [PositionEdgesService],
  template: `
    <table appPositionSticky class="list-table">
      <tfoot #stickyHeader appColumnWidths
        class="app-skill-list-header sticky-header"
        [hasInherit]="!!inheritOrder"
        [hasTarget]="hasTarget"
        [hasRank]="hasRank"
        [lang]="lang"
        [transferTitle]="transferTitle"
        [sortFunIndex]="sortFunIndex"
        (sortFunIndexChanged)="sortFunIndex = $event">
      </tfoot>
    </table>
    <table class="list-table">
      <tfoot #hiddenHeader appColumnWidths
        class="app-skill-list-header"
        [hasInherit]="!!inheritOrder"
        [hasTarget]="hasTarget"
        [hasRank]="hasRank"
        [lang]="lang"
        [transferTitle]="transferTitle"
        [style.visibility]="'collapse'">
      </tfoot>
      <tbody>
        @for (data of rowData; track data) {
          <tr class="app-smt-skill-list-row"
            [hasInherit]="!!inheritOrder"
            [hasTarget]="hasTarget"
            [hasRank]="hasRank"
            [isPersona]="isPersona"
            [hasTransferTitle]="!!transferTitle"
            [hasSkillCards]="transferTitle.includes('Card')"
            [lang]="lang"
            [data]="data"
            [ngClass]="{
              extra: data.rank > 70 && data.rank < 90,
              unique: data.rank > 90
            }">
          </tr>
        }
      </tbody>
    </table>
  `
})
export class SmtSkillListComponent extends SkillListComponent<Skill> {
  @Input() hasTarget = false;
  @Input() hasRank = true;
  @Input() isPersona = false;
  @Input() lang = 'en';
  @Input() transferTitle = '';
}
