import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';

import { SortedTableHeaderComponent } from '../../shared/sorted-table.component';
import Translations from '../data/translations.json';

@Component({
  selector: 'tfoot.app-skill-list-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tr>
      <th [attr.colSpan]="skillHeaderLen">{{ msgs.Skill | translateComp:lang }}</th>
      <th [attr.colSpan]="acquireHeaderLen">{{ msgs.HowToAcquire | translateComp:lang }}</th>
    </tr>
    <tr>
      <th class="sortable" [ngClass]="sortDirClass(1)" (click)="nextSortFunIndex(1)"><span>{{ msgs.Elem | translateComp:lang }}</span></th>
      <th class="sortable" [ngClass]="sortDirClass(2)" (click)="nextSortFunIndex(2)"><span>{{ msgs.Name | translateComp:lang }}</span></th>
      <th class="sortable" [ngClass]="sortDirClass(3)" (click)="nextSortFunIndex(3)"><span class="cost">{{ msgs.Cost | translateComp:lang }}</span></th>
      <th>{{ msgs.Effect |  translateComp:lang }}</th>
      <th *ngIf="hasTarget">{{ msgs.Target | translateComp:lang }}</th>
      <th *ngIf="hasRank" class="sortable" [ngClass]="sortDirClass(4)" (click)="nextSortFunIndex(4)"><span>{{ msgs.Rank | translateComp:lang }}</span></th>
      <th *ngIf="hasInherit" class="sortable" [ngClass]="sortDirClass(5)" (click)="nextSortFunIndex(5)"><span>Inherit</span></th>
      <th>{{ msgs.LearnedBy | translateComp:lang }}</th>
      <th *ngIf="transferTitle">{{ transferTitle }}</th>
    </tr>
  `,
  styles: [`
    th { white-space: nowrap; }
    span { padding: 0.6em; }
    span.cost { padding: 1.2em; }
  `]
})
export class SkillListHeaderComponent extends SortedTableHeaderComponent implements OnInit {
  @Input() hasInherit = false;
  @Input() hasTarget = true;
  @Input() hasRank = true;
  @Input() lang = 'en';
  @Input() transferTitle = '';
  skillHeaderLen = 4;
  acquireHeaderLen = 1;
  msgs = Translations.SkillListComponent;

  ngOnInit() {
    this.nextColIndices();
  }

  private nextColIndices() {
    if (this.hasInherit) {
      this.skillHeaderLen += 1;
    } if (this.hasTarget) {
      this.skillHeaderLen += 1;
    } if (this.hasRank) {
      this.skillHeaderLen += 1;
    } if (this.transferTitle) {
      this.acquireHeaderLen += 1;
    }
  }
}
