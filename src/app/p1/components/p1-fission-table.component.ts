import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SmtFissionTableComponent } from '../../compendium/components/smt-fission-table.component';
import { NamePair, FusionPair } from '../../compendium/models';
import { toFusionPair } from '../models/conversions';

@Component({
  selector: 'app-p1-fission-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table *ngIf="fusionPrereq" class="list-table">
      <thead><tr><th class="title">Special Fusion Condition</th></tr></thead>
      <tbody><tr><td>{{ fusionPrereq }}</td></tr></tbody>
    </table>
    <app-fusion-entry-table *ngIf="fusionEntries.length"
      [title]="'Special Fusion Ingredients for ' + currentDemon"
      [baseUrl]="'../../demons'"
      [rowData]="fusionEntries"
      [isFusion]="true">"
    </app-fusion-entry-table>
    <app-fusion-pair-table *ngIf="fusionPairs.length || !fusionPrereq && !fusionEntries.length"
      [title]="'Ingredient 1 x Ingredient 2 = ' + currentDemon"
      [leftBaseUrl]="'../../demons'"
      [rightBaseUrl]="'../../demons'"
      [rowData]="fusionPairs">
    </app-fusion-pair-table>
  `
})
export class P1FissionTableComponent extends SmtFissionTableComponent {
  toFusionPair = (currentDemon: string) => (names: NamePair): FusionPair => toFusionPair(names, this.compendium);
}
