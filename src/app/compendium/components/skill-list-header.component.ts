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
      <th [attr.colSpan]="skillHeaderLen">Skill</th>
      <th [attr.colSpan]="acquireHeaderLen">How To Acquire</th>
    </tr>
    <tr>
      <th class="sortable" [ngClass]="sortDirClass(1)" (click)="nextSortFunIndex(1)">Elem<span>--</span></th>
      <th class="sortable" [ngClass]="sortDirClass(2)" (click)="nextSortFunIndex(2)">Name</th>
      <th class="sortable" [ngClass]="sortDirClass(3)" (click)="nextSortFunIndex(3)">Cost<span>--</span></th>
      <th>Effect</th>
      <th *ngIf="hasTarget">Target</th>
      <th *ngIf="hasRank" class="sortable" [ngClass]="sortDirClass(4)" (click)="nextSortFunIndex(4)">Rank<span>--</span></th>
      <th *ngIf="hasInherit" class="sortable" [ngClass]="sortDirClass(5)" (click)="nextSortFunIndex(5)">Inherit<span>--</span></th>
      <th>Learned By</th>
      <th *ngIf="transferTitle">{{ transferTitle }}</th>
    </tr>
  `,
  styles: [`
    span {
      color: transparent;
    }
  `]
})
export class SkillListHeaderComponent extends SortedTableHeaderComponent implements OnInit {
  @Input() hasInherit = false;
  @Input() hasTarget = true;
  @Input() hasRank = true;
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
