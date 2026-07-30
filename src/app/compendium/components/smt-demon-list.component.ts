import { Component, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PositionEdgesService } from '../../shared/position-edges.service';
import { Demon } from '../models';
import { DemonListComponent } from '../bases/demon-list.component';
import { ElementAffinityToStringPipe, LvlToNumberPipe, ReslvlToColorPipe, ReslvlToStringLocalePipe } from '../pipes';
import { ColumnWidthsDirective } from '../../shared/column-widths.directive';
import { PositionStickyDirective } from '../../shared/position-sticky.directive';
import { DemonListHeaderComponent } from './demon-list-header.component';

@Component({
  selector: 'tr.app-smt-demon-list-row',
  imports: [
    CommonModule, RouterModule,
    ElementAffinityToStringPipe, LvlToNumberPipe, ReslvlToColorPipe, ReslvlToStringLocalePipe
  ],
  template: `
    <td [ngClass]="['align', data.align ? data.align : 'none']">{{ data.race }}</td>
    @if (!hasCurrLvl) { <td>{{ data.lvl | lvlToNumber }}</td> }
    @if (hasCurrLvl) {
      <td style="text-align: center;">
        @if (!currOffset) {
          <button (click)="updateCurrRange()">{{ data.currLvl }} &#9998;</button>
        }
        @if (currOffset) {
          <select (change)="emitValidLvl($event)">
            <option [value]="data.currLvl">{{ data.currLvl }}</option>
            @for (_ of currRange; track _; let i = $index) {
              <option [value]="i + currOffset">{{ i + currOffset }}</option>
            }
          </select>
        }
      </td>
    }
    <td><a [routerLink]="data.name">{{ data.name }}</a></td>
    @if (hasInherits) { <td><div [ngClass]="['element-icon', 'inherit-icon', 'i' + data.inherits]">{{ data.inherits }}</div></td> }
    @for (stat of data.stats; track stat) {
      <td>{{ stat }}</td>
    }
    @for (resist of data.resists; track resist) {
      <td [ngClass]="['resists', resist | reslvlToColor]">{{ resist | reslvlToStringLocale:lang }}</td>
    }
    @if (hasAffinity) {
      @for (affinity of data.affinities; track affinity) {
        <td [ngClass]="'affinity' + affinity">{{ affinity | affinityToString }}</td>
      }
    }
    @if (isEnemy) { <td>{{ data.drop }}</td> }
    @if (isEnemy) { <td>{{ data.area }}</td> }
  `
})
export class SmtDemonListRowComponent {
  @Input() isEnemy = false;
  @Input() hasCurrLvl = false;
  @Input() hasInherits = false;
  @Input() hasAffinity = false;
  @Input() lang = 'en';
  @Input() data: Demon;
  currLvl = output<number>();

  currOffset = 0;
  currRange = Array(0);

  updateCurrRange() {
    if (this.currOffset !== 0) { return; }
    this.currOffset = Math.floor(this.data.lvl);
    this.currRange = Array(100 - this.currOffset);
  }

  emitValidLvl(lvlEvent: Event) {
    const lvl = parseInt((<HTMLInputElement>lvlEvent.target).value, 10);

    if (this.data.currLvl !== lvl && 0 < lvl && lvl < 100 && Number.isInteger(lvl)) {
      this.data.currLvl = lvl;
      this.currLvl.emit(lvl);
    }
  }
}

@Component({
  selector: 'app-smt-demon-list',
  imports: [
    CommonModule,
    ColumnWidthsDirective, PositionStickyDirective,
    DemonListHeaderComponent, SmtDemonListRowComponent 
  ],
  providers: [PositionEdgesService],
  template: `
    <table appPositionSticky class="list-table">
      <tfoot #stickyHeader appColumnWidths
        class="app-demon-list-header sticky-header"
        [isPersona]="isPersona"
        [isEnemy]="isEnemy"
        [lang]="lang"
        [hasInherits]="!!inheritOrder"
        [statHeaders]="statHeaders"
        [resistHeaders]="resistHeaders"
        [affinityHeaders]="affinityHeaders"
        [sortFunIndex]="sortFunIndex"
        (sortFunIndexChanged)="sortFunIndex = $event"
        (searchTagsChanged)="searchTags = $event">
      </tfoot>
    </table>
    <table class="list-table">
      <tfoot #hiddenHeader appColumnWidths
        class="app-demon-list-header"
        [isPersona]="isPersona"
        [isEnemy]="isEnemy"
        [lang]="lang"
        [hasInherits]="!!inheritOrder"
        [statHeaders]="statHeaders"
        [resistHeaders]="resistHeaders"
        [affinityHeaders]="affinityHeaders"
        [style.visibility]="'collapse'">
      </tfoot>
      <tbody>
        @for (data of rowData; track data) {
          <tr
            class="app-smt-demon-list-row"
            [isEnemy]="isEnemy"
            [hasCurrLvl]="hasCurrLvl"
            [hasInherits]="!!inheritOrder"
            [hasAffinity]="!!affinityHeaders"
            [lang]="lang"
            [ngClass]="{
              special: data.fusion === 'special',
              exception: data.fusion !== 'special' && data.fusion !== 'normal',
              hidden: !data.searchTags.includes(searchTags)
            }"
            [data]="data"
            (currLvl)="lvlChanged.emit({ demon: data.name, currLvl: $event })">
          </tr>
        }
      </tbody>
    </table>
  `
})
export class SmtDemonListComponent extends DemonListComponent<Demon> {
  @Input() isPersona = false;
  @Input() isEnemy = false;
  @Input() hasCurrLvl = false;
  @Input() lang = 'en';
  lvlChanged = output<{ demon: string, currLvl: number }>();
  searchTags = '';
}
