import { Component, computed } from '@angular/core';
import { SmtFusionTableComponent } from '../../compendium/components/smt-fusion-table.component';
import { NamePair, FusionPair } from '../../compendium/models';
import { toFusionPairResult } from '../models/conversions';
import { FusionPairTableComponent } from '../../compendium/components/fusion-pair-table.component';
import { TranslateCompPipe } from '../../compendium/pipes';

@Component({
  selector: 'app-p1-fusion-table',
  imports: [FusionPairTableComponent, TranslateCompPipe],
  templateUrl: '../../compendium/components/smt-fusion-table.component.html'
})
export class P1FusionTableComponent extends SmtFusionTableComponent {
  hasFusionToPersonas = true;
  toFusionPair$ = computed(() => (currentDemon: string) => 
    (names: NamePair): FusionPair => toFusionPairResult(currentDemon, names, this.compendium$())
  );
}
