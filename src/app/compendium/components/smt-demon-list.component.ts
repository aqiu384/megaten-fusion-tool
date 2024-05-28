import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { PositionEdgesService } from '../../shared/position-edges.service';
import { Demon } from '../models';
import { DemonListComponent } from '../bases/demon-list.component';

@Component({
  selector: 'tr.app-smt-demon-list-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <td [ngClass]="['align', data.align ? data.align : 'none']">{{ data.race }}</td>
    <td *ngIf="!hasCurrLvl">{{ data.lvl | lvlToNumber }}</td>
    <td *ngIf="hasCurrLvl" style="text-align: center;">
      <button *ngIf="!currOffset" (click)="updateCurrRange()">{{ data.currLvl }} &#9998;</button>
      <select *ngIf="currOffset" (change)="emitValidLvl($event)">
        <option [value]="data.currLvl">{{ data.currLvl }}</option>
        <option *ngFor="let _ of currRange; let i = index" [value]="i + currOffset">{{ i + currOffset }}</option>
      </select>
    </td>
    <td><a [routerLink]="data.name">{{ data.name }}</a></td>
    <td *ngIf="hasInherits"><div [ngClass]="['element-icon',  'i' + data.inherits]">{{ data.inherits }}</div></td>
    <td *ngFor="let stat of data.stats">{{ stat }}</td>
    <td *ngFor="let resist of data.resists" [ngClass]="['resists', resist | reslvlToColor]">
      {{ resist | reslvlToStringJa:lang }}
    </td>
    <ng-container *ngIf="hasAffinity">
      <td *ngFor="let affinity of data.affinities" [ngClass]="'affinity' + affinity">
        {{ affinity | affinityToString }}
      </td>
    </ng-container>
    <td *ngIf="isEnemy">{{ data.drop }}</td>
    <td *ngIf="isEnemy">{{ data.area }}</td>
  `
})
export class SmtDemonListRowComponent {
  @Input() isEnemy = false;
  @Input() hasCurrLvl = false;
  @Input() hasInherits = false;
  @Input() hasAffinity = false;
  @Input() lang = 'en';
  @Input() data: Demon;
  @Output() currLvl = new EventEmitter<number>();

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ PositionEdgesService ],
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
        (sortFunIndexChanged)="sortFunIndex = $event">
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
        <tr *ngFor="let data of rowData"
          class="app-smt-demon-list-row"
          [isEnemy]="isEnemy"
          [hasCurrLvl]="hasCurrLvl"
          [hasInherits]="!!inheritOrder"
          [hasAffinity]="!!affinityHeaders"
          [lang]="lang"
          [ngClass]="{
            special: data.fusion === 'special',
            exception: data.fusion !== 'special' && data.fusion !== 'normal'
          }"
          [data]="data"
          (currLvl)="lvlChanged.emit({ demon: data.name, currLvl: $event })">
        </tr>
      </tbody>
    </table>
  `
})
export class SmtDemonListComponent extends DemonListComponent<Demon> {
  @Input() isPersona = false;
  @Input() isEnemy = false;
  @Input() hasCurrLvl = false;
  @Input() lang = 'en';
  @Output() lvlChanged = new EventEmitter<{ demon: string, currLvl: number }>();
}
