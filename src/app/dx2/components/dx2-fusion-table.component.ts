import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SmtFusionTableComponent, SmtFusionTableComponentTemplate } from '../../compendium/components/smt-fusion-table.component';
import { NamePair, FusionPair } from '../../compendium/models';
import { toFusionPairResult } from '../models/conversions';

@Component({
  selector: 'app-dx2-fusion-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: SmtFusionTableComponentTemplate
})
export class Dx2FusionTableComponent extends SmtFusionTableComponent {
  toFusionPair = (currentDemon: string) => (names: NamePair): FusionPair => toFusionPairResult(currentDemon, names, this.compendium);
}
