import { Component, computed, inject } from '@angular/core';
import { SmtFissionTableComponent } from '../../compendium/components/smt-fission-table.component';
import { NamePair, FusionPair } from '../../compendium/models';
import { toFusionPair, inheritSkills } from '../models/conversions';
import { FusionEntryTableComponent } from '../../compendium/components/fusion-entry-table.component';
import { FusionPairTableComponent } from '../../compendium/components/fusion-pair-table.component';
import { TranslateCompPipe } from '../../compendium/pipes';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-p1-fission-table',
  imports: [FusionEntryTableComponent, FusionPairTableComponent, TranslateCompPipe],
  templateUrl: '../../compendium/components/smt-fission-table.component.html'
})
export class P1FissionTableComponent extends SmtFissionTableComponent {
  fusionDataService = inject(FusionDataService);
  compendium$ = this.fusionDataService.compendium$;

  hasFissionFromDemons = true;
  toFusionPair$ = computed(() => (_: string) =>
    (names: NamePair): FusionPair => toFusionPair(names, this.compendium$()
  ));
  getNotes$ = computed<(pair: FusionPair) => string>(() => {
    const comp = this.compendium$();
    const demonR = comp.getDemon(this.currentDemon$());
    return pair => inheritSkills(
      comp.getDemon(pair.name1),
      comp.getDemon(pair.name2),
      demonR,
      comp
    )
  });
}
