import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SmtFissionTableComponent, SmtFissionTableComponentTemplate } from '../../compendium/components/smt-fission-table.component';
import { NamePair, FusionPair } from '../../compendium/models';
import { toFusionPair } from '../models/conversions';

@Component({
  selector: 'app-p1-fission-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: SmtFissionTableComponentTemplate
})
export class P1FissionTableComponent extends SmtFissionTableComponent {
  hasFissionFromDemons = true;
  toFusionPair = (currentDemon: string) => (names: NamePair): FusionPair => toFusionPair(names, this.compendium);
}
