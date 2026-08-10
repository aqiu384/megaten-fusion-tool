import { Component, computed, inject } from '@angular/core';
import { FusionPair } from '../../compendium/models';
import { FusionPairTableComponent } from '../../compendium/components/fusion-pair-table.component';
import { TranslateCompPipe } from '../../compendium/pipes';
import { SmtFusionTableComponent } from '../../compendium/components/smt-fusion-table.component';
import { FusionDataService } from '../fusion-data.service';

@Component({
  imports: [FusionPairTableComponent, TranslateCompPipe],
  templateUrl: '../../compendium/components/smt-fusion-table.component.html'
})
export class NesFusionTableComponent extends SmtFusionTableComponent {
  fusionDataService = inject(FusionDataService);

  getNotes$ = computed(() => {
    const comp = this.compendium$();
    const compConfig = this.fusionDataService.compConfig;
    const result = comp.getDemon(this.currentDemon$());
    const canInherit = result && compConfig.inheritSkills.length > 0;
    return canInherit ? (pair: FusionPair) => compConfig.getInheritSkills(
      comp.getDemon(pair.name2),
      [comp.getDemon(pair.name1), result],
      compConfig
    ).join(', ') || '-' : null;
  });
}
