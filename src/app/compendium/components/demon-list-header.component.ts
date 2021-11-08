import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { SortedTableHeaderComponent } from '../../shared/sorted-table.component';

@Component({
  selector: 'tfoot.app-demon-list-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tr>
      <th [attr.colSpan]="hasInherits ? 4 : 3">{{ langEn ? (isPersona ? 'Persona' : 'Demon') : '悪魔' }}</th>
      <th *ngIf="statColIndices.length" [attr.colSpan]="statColIndices.length">{{ langEn ? 'Stats' : 'ステータス' }}</th>
      <th *ngIf="resistColIndices.length" [attr.colSpan]="resistColIndices.length">{{ langEn ? 'Resistances' : '耐性' }}</th>
      <th *ngIf="affinityColIndices.length" [attr.colSpan]="affinityColIndices.length">{{ langEn ? 'Affinities' : 'スキル適正' }}</th>
      <th *ngIf="isEnemy" colspan="2">Enemy</th>
    </tr>
    <tr>
      <th class="sortable" [ngClass]="sortDirClass(1)" (click)="nextSortFunIndex(1)"><span>{{ langEn ? 'Race' : '種族' }}</span></th>
      <th class="sortable" [ngClass]="sortDirClass(2)" (click)="nextSortFunIndex(2)"><span>Lvl</span></th>
      <th class="sortable" [ngClass]="sortDirClass(3)" (click)="nextSortFunIndex(3)"><span>{{ langEn ? 'Name' : '悪魔名' }}</span></th>
      <th *ngIf="hasInherits" class="sortable" [ngClass]="sortDirClass(4)" (click)="nextSortFunIndex(4)">Inherits</th>
      <th *ngFor="let pair of statColIndices" class="sortable" (click)="nextSortFunIndex(pair.index)">
        {{ pair.stat }}
      </th>
      <th *ngFor="let pair of resistColIndices"
        class="sortable"
        (click)="nextSortFunIndex(pair.index)">
        <div class="element-icon {{ pair.elem }}"></div>
      </th>
      <th *ngFor="let pair of affinityColIndices"
        class="sortable"
        (click)="nextSortFunIndex(pair.index)">
        <div class="element-icon {{ pair.elem }}"></div>
      </th>
      <th *ngIf="isEnemy">Drops</th>
      <th *ngIf="isEnemy">Appears</th>
    </tr>
  `,
  styles: [`
    th { white-space: nowrap; }
    span { padding-right: 0.6em; }
  `]
})
export class DemonListHeaderComponent extends SortedTableHeaderComponent implements OnInit {
  @Input() isEnemy = false;
  @Input() isPersona = false;
  @Input() hasInherits = false;
  @Input() langEn = true;
  @Input() statHeaders: string[] = [];
  @Input() resistHeaders: string[] = [];
  @Input() affinityHeaders: string[] = [];
  statColIndices: { stat: string, index: number }[] = [];
  resistColIndices: { elem: string, index: number }[] = [];
  reslvlColIndices: { elem: string, index: number }[] = [];
  affinityColIndices: { elem: string, index: number }[] = [];

  ngOnInit() {
    this.nextColIndices();
  }

  private nextColIndices() {
    let index = this.hasInherits ? 5 : 4;

    if (this.statHeaders) {
      this.statColIndices = this.statHeaders.map((stat, i) => ({ stat, index: i + index }));
      index += this.statHeaders.length;
    }

    if (this.resistHeaders) {
      this.resistColIndices = this.resistHeaders.map((elem, i) => ({ elem, index: i + index }));
      index += this.resistHeaders.length;
    }

    if (this.affinityHeaders) {
      this.affinityColIndices = this.affinityHeaders.map((elem, i) => ({ elem, index: i + index }));
    }
  }
}
