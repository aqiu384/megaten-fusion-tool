import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SmtFusionTableComponent } from '../../compendium/components/smt-fusion-table.component';
import { NamePair, FusionPair } from '../../compendium/models';
import { toFusionPairResult } from '../models/conversions';

@Component({
  selector: 'app-dx2-fusion-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fusion-pair-table
      [title]="currentDemon + ' x Ingredient 2 = Result'"
      [leftHeader]="'Ingredient 2'"
      [rightHeader]="'Result'"
      [rowData]="fusionPairs">
    </app-fusion-pair-table>
  `
})
export class Dx2FusionTableComponent extends SmtFusionTableComponent {
  toFusionPair = (currentDemon: string) => (names: NamePair): FusionPair => toFusionPairResult(currentDemon, names, this.compendium);
}
