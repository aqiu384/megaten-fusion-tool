import { Component, computed } from '@angular/core';
import { SmtFissionTableComponent } from '../../compendium/components/smt-fission-table.component';
import { NamePair, FusionPair } from '../../compendium/models';
import { toFusionPair } from '../models/conversions';
import { FusionEntryTableComponent } from '../../compendium/components/fusion-entry-table.component';
import { FusionPairTableComponent } from '../../compendium/components/fusion-pair-table.component';
import { TranslateCompPipe } from '../../compendium/pipes';

@Component({
  selector: 'app-p1-fission-table',
  imports: [FusionEntryTableComponent, FusionPairTableComponent, TranslateCompPipe],
  templateUrl: '../../compendium/components/smt-fission-table.component.html'
})
export class P1FissionTableComponent extends SmtFissionTableComponent {
  hasFissionFromDemons = true;
  toFusionPair$ = computed(() => (_: string) =>
    (names: NamePair): FusionPair => toFusionPair(names, this.compendium$()
  ));
}
