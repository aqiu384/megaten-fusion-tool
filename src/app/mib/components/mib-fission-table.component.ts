import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SmtFissionTableComponent } from '../../compendium/components/smt-fission-table.component';
import { NamePair, FusionPair } from '../../compendium/models';
import { toFusionPair } from '../models/conversions';

@Component({
  selector: 'app-mib-fission-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table *ngIf="fusionPrereq">
      <thead><tr><th>Special Fusion Condition</th></tr></thead>
      <tbody><tr><td>{{ fusionPrereq }}</td></tr></tbody>
    </table>
    <app-fusion-entry-table *ngIf="fusionEntries.length"
      [title]="'Special Fusion Ingredients for ' + currentDemon"
      [baseUrl]="'../../demons'"
      [rowData]="fusionEntries">
    </app-fusion-entry-table>
    <app-fusion-pair-table *ngIf="fusionPairs.length || !fusionPrereq && !fusionEntries.length"
      [title]="'Ingredient 1 x Ingredient 2 = ' + currentDemon"
      [leftBaseUrl]="'../../demons'"
      [rightBaseUrl]="'../../demons'"
      [rowData]="fusionPairs">
    </app-fusion-pair-table>
  `
})
export class MibFissionTableComponent extends SmtFissionTableComponent {
  toFusionPair = (names: NamePair): FusionPair => toFusionPair(names, this.compendium);
}
