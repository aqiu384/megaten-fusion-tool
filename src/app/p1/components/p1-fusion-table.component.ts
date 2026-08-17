import { Component, computed, inject } from '@angular/core';
import { SmtFusionTableComponent } from '../../compendium/components/smt-fusion-table.component';
import { NamePair, FusionPair } from '../../compendium/models';
import { inheritSkills, toFusionPairResult } from '../models/conversions';
import { FusionPairTableComponent } from '../../compendium/components/fusion-pair-table.component';
import { TranslateCompPipe } from '../../compendium/pipes';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-p1-fusion-table',
  imports: [FusionPairTableComponent, TranslateCompPipe],
  templateUrl: '../../compendium/components/smt-fusion-table.component.html'
})
export class P1FusionTableComponent extends SmtFusionTableComponent {
  fusionDataService = inject(FusionDataService);
  compendium$ = this.fusionDataService.compendium$;

  hasFusionToPersonas = true;
  toFusionPair$ = computed(() => (currentDemon: string) => 
    (names: NamePair): FusionPair => toFusionPairResult(currentDemon, names, this.compendium$())
  );
  getNotes$ = computed<(pair: FusionPair) => string>(() => {
    const comp = this.compendium$();
    const demon1 = comp.getDemon(this.currentDemon$());
    return pair => inheritSkills(
      demon1,
      comp.getDemon(pair.name1),
      comp.getDemon(pair.name2),
      comp
    )
  });
}
