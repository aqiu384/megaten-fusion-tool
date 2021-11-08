import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit
} from '@angular/core';

import { SortedTableHeaderComponent } from '../../shared/sorted-table.component';

@Component({
  selector: 'tfoot.app-skill-list-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tr>
      <th [attr.colSpan]="skillHeaderLen">{{ langEn ? 'Skill' : 'スキル' }}</th>
      <th [attr.colSpan]="acquireHeaderLen">{{ langEn ? 'How To Acquire' : '悪魔' }}</th>
    </tr>
    <tr>
      <th class="sortable" [ngClass]="sortDirClass(1)" (click)="nextSortFunIndex(1)"><span>{{ langEn ? 'Elem' : '属性' }}</span></th>
      <th class="sortable" [ngClass]="sortDirClass(2)" (click)="nextSortFunIndex(2)"><span>{{ langEn ? 'Name' : 'スキル名' }}</span></th>
      <th class="sortable" [ngClass]="sortDirClass(3)" (click)="nextSortFunIndex(3)"><span>{{ langEn ? 'Cost' : '消費' }}</span></th>
      <th>{{ langEn ? 'Effect' : '説明' }}</th>
      <th *ngIf="hasTarget">{{ langEn ? 'Target' : '範囲' }}</th>
      <th *ngIf="hasRank" class="sortable" [ngClass]="sortDirClass(4)" (click)="nextSortFunIndex(4)"><span>{{ langEn ? 'Rank' : 'ランク' }}</span></th>
      <th *ngIf="hasInherit" class="sortable" [ngClass]="sortDirClass(5)" (click)="nextSortFunIndex(5)"><span>Inherit</span></th>
      <th>{{ langEn ? 'Learned By' : '習得' }}</th>
      <th *ngIf="transferTitle">{{ transferTitle }}</th>
    </tr>
  `,
  styles: [`
    th { white-space: nowrap; }
    span { padding-right: 0.6em; }
  `]
})
export class SkillListHeaderComponent extends SortedTableHeaderComponent implements OnInit {
  @Input() hasInherit = false;
  @Input() hasTarget = true;
  @Input() hasRank = true;
  @Input() langEn = true;
  @Input() transferTitle = '';
  skillHeaderLen = 4;
  acquireHeaderLen = 1;

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
