import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SmtFissionTableComponent, SmtFissionTableComponentTemplate } from '../../compendium/components/smt-fission-table.component';
import { NamePair, FusionPair } from '../../compendium/models';
import { toFusionPair } from '../models/conversions';

@Component({
  selector: 'app-dx2-fission-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: SmtFissionTableComponentTemplate
})
export class Dx2FissionTableComponent extends SmtFissionTableComponent {
  toFusionPair = (currentDemon: string) => (names: NamePair): FusionPair => toFusionPair(currentDemon, names, this.compendium);
}
