import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { PositionEdgesService } from '../../shared/position-edges.service';
import { SkillListComponent } from '../../compendium/bases/skill-list.component';
import { Skill } from '../models';

@Component({
  selector: 'tr.app-smt-skill-list-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <td><div class="element-icon {{ data.element }}">{{ data.element }}</div></td>
    <td>{{ data.name }}</td>
    <td [style.color]="data.cost ? null: 'transparent'">{{ data.cost | skillCostToString }}</td>
    <td *ngIf="data.damage">
      {{ data.damage }}
      {{ data.element }}
      damage{{ data.hits ? ' x' + data.hits : '' }}{{ data.effect ? ', ' + data.effect : '' }}
    </td>
    <td *ngIf="!data.damage">{{ data.effect }}</td>
    <td *ngIf="hasTarget"><div class="target-icon a{{ data.target || 'Self' }}">{{ data.target || 'Self' }}</div></td>
    <td *ngIf="hasRank" [style.color]="data.rank !== 99 ? null: 'transparent'">{{ data.rank }}</td>
    <td *ngIf="data.inherit"><div class="element-icon {{ data.inherit.toLowerCase() }}">{{ data.inherit }}</div></td>
    <td *ngIf="hasLvl" [ngClass]="'lvl' + data.level.toString()">{{ data.level | skillLevelToString }}</td>
    <td *ngIf="hasLearned">
      <ul class="comma-list">
        <li *ngFor="let entry of data.learnedBy">
          <a routerLink="../{{ isPersona ? 'personas' : 'demons' }}/{{ entry.demon }}">{{ entry.demon }}</a>
          {{ entry.level | skillLevelToShortString }}
        </li>
      </ul>
    </td>
    <td *ngIf="hasTransferTitle">
      <ul class="comma-list">
        <li *ngFor="let entry of data.transfer">
          <ng-container *ngIf="entry.level >= -99">
            <a routerLink="../{{ isPersona ? 'personas' : 'demons' }}/{{ entry.demon }}">{{ entry.demon }}</a>
            {{ entry.level | skillLevelToShortString }}
          </ng-container>
          <ng-container *ngIf="entry.level < -99">{{ entry.demon }} </ng-container>
        </li>
      </ul>
    </td>
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
  @Input() data: Skill;
}

@Component({
  selector: 'app-smt-skill-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ PositionEdgesService ],
  template: `
    <table appPositionSticky>
      <tfoot #stickyHeader appColumnWidths
        class="app-skill-list-header sticky-header"
        [hasInherit]="inheritOrder"
        [hasTarget]="hasTarget"
        [hasRank]="hasRank"
        [transferTitle]="transferTitle"
        [sortFunIndex]="sortFunIndex"
        (sortFunIndexChanged)="sortFunIndex = $event">
      </tfoot>
    </table>
    <table>
      <tfoot #hiddenHeader appColumnWidths
        class="app-skill-list-header"
        [hasInherit]="inheritOrder"
        [hasTarget]="hasTarget"
        [hasRank]="hasRank"
        [transferTitle]="transferTitle"
        [style.visibility]="'collapse'">
      </tfoot>
      <tbody>
        <tr *ngFor="let data of rowData"
          class="app-smt-skill-list-row"
          [hasInherit]="inheritOrder"
          [hasTarget]="hasTarget"
          [hasRank]="hasRank"
          [isPersona]="isPersona"
          [hasTransferTitle]="transferTitle"
          [data]="data"
          [ngClass]="{
            extra: data.rank > 70 && data.rank < 90,
            unique: data.rank > 90
          }">
        </tr>
      </tbody>
    </table>
  `
})
export class SmtSkillListComponent extends SkillListComponent<Skill> {
  @Input() hasTarget = false;
  @Input() hasRank = true;
  @Input() isPersona = false;
  @Input() transferTitle = '';
}
