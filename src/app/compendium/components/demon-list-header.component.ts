import { Component, Input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortedTableHeaderComponent } from '../../shared/sorted-table.component';
import { TranslateCompPipe, TranslateElementLabelPipe } from '../pipes';
import Translations from '../data/translations.json';

@Component({
  selector: 'tfoot.app-demon-list-header',
  imports: [CommonModule, TranslateCompPipe, TranslateElementLabelPipe],
  template: `
    <tr>
      <th class="nav" [style.height.em]="1" [attr.colSpan]="hasInherits ? 4 : 3" (click)="showFilter = true">
        @if (!showFilter) {
          Show {{ (isPersona ? msgs.Persona : msgs.Demon) | translateComp:lang }} Filter
        }
        @if (showFilter) {
          <input type="text"
            placeholder="name, race, etc."
            (input)="searchTagsChanged.emit($any($event.target).value.toLocaleLowerCase())"/>
        }
      </th>
      @if (statColIndices.length) {
        <th [attr.colSpan]="statColIndices.length">{{ msgs.Stats | translateComp:lang }}</th>
      }
      @if (resistColIndices.length) {
        <th [attr.colSpan]="resistColIndices.length">{{ msgs.Resistances | translateComp:lang }}</th>
      }
      @if (affinityColIndices.length) {
        <th [attr.colSpan]="affinityColIndices.length">{{ msgs.Affinities | translateComp:lang }}</th>
      }
      @if (isEnemy) {
        <th colspan="2">Enemy</th>
      }
    </tr>
    <tr>
      <th class="sortable" [ngClass]="sortDirClass(1)" (click)="nextSortFunIndex(1)"><span>{{ msgs.Race | translateComp:lang }}</span></th>
      <th class="sortable" [ngClass]="sortDirClass(2)" (click)="nextSortFunIndex(2)"><span>Lvl</span></th>
      <th class="sortable" [ngClass]="sortDirClass(3)" (click)="nextSortFunIndex(3)"><span>{{ msgs.Name | translateComp:lang }}</span></th>
      @if (hasInherits) {
        <th class="sortable" [ngClass]="sortDirClass(4)" (click)="nextSortFunIndex(4)">Inherits</th>
      }
      @for (pair of statColIndices; track pair) {
        <th class="sortable" (click)="nextSortFunIndex(pair.index)">
          {{ pair.stat }}
        </th>
      }
      @for (pair of resistColIndices; track pair) {
        <th
          class="sortable"
          (click)="nextSortFunIndex(pair.index)">
          <div [title]="pair.elem | translateElementLabel:lang" class="element-icon {{ pair.elem }}"></div>
        </th>
      }
      @for (pair of affinityColIndices; track pair) {
        <th
          class="sortable"
          (click)="nextSortFunIndex(pair.index)">
          <div [title]="pair.elem | translateElementLabel:lang" class="element-icon {{ pair.elem }}"></div>
        </th>
      }
      @if (isEnemy) {
        <th>Drops</th>
      }
      @if (isEnemy) {
        <th>Appears</th>
      }
    </tr>
  `,
  styles: [`
    th { white-space: nowrap; }
    th input { width: 80%; }
    span { padding-right: 0.6em; }
  `]
})
export class DemonListHeaderComponent extends SortedTableHeaderComponent implements OnInit {
  @Input() isEnemy = false;
  @Input() isPersona = false;
  @Input() hasInherits = false;
  @Input() lang = 'en';
  @Input() statHeaders: string[] = [];
  @Input() resistHeaders: string[] = [];
  @Input() affinityHeaders: string[] = [];
  searchTagsChanged = output<string>();
  statColIndices: { stat: string, index: number }[] = [];
  resistColIndices: { elem: string, index: number }[] = [];
  reslvlColIndices: { elem: string, index: number }[] = [];
  affinityColIndices: { elem: string, index: number }[] = [];
  msgs = Translations.DemonListComponent;
  showFilter = false;

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
