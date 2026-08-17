import { Component, computed, inject } from '@angular/core';
import { FusionPair } from '../../compendium/models';
import { FusionEntryTableComponent } from '../../compendium/components/fusion-entry-table.component';
import { FusionPairTableComponent } from '../../compendium/components/fusion-pair-table.component';
import { TranslateCompPipe } from '../../compendium/pipes';
import { SmtFissionTableComponent } from '../../compendium/components/smt-fission-table.component';
import { FusionDataService } from '../fusion-data.service';

@Component({
  imports: [FusionEntryTableComponent, FusionPairTableComponent, TranslateCompPipe],
  templateUrl: '../../compendium/components/smt-fission-table.component.html'
})
export class NesFissionTableComponent extends SmtFissionTableComponent {
  fusionDataService = inject(FusionDataService);
  compendium$ = this.fusionDataService.compendium$;

  fusionPairs$ = computed(() => this.calculator
    .getFusions(this.currentDemon$(), this.compendium$(), this.fusionChart$())
    .concat(this.compendium$().getExtraNamePairs(this.currentDemon$()))
    .map(this.toFusionPair$()(this.currentDemon$()))
  );
  getNotes$ = computed(() => {
    const comp = this.compendium$();
    const compConfig = this.fusionDataService.compConfig;
    const result = comp.getDemon(this.currentDemon$());
    const canInherit = result && compConfig.inheritSkills.length > 0;
    return canInherit ? (pair: FusionPair) => compConfig.getInheritSkills(
      result,
      [comp.getDemon(pair.name1), comp.getDemon(pair.name2)],
      compConfig
    ).join(', ') || '-' : null;
  });
}
