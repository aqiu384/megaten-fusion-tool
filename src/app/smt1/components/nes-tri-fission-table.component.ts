import { Component, computed, inject } from '@angular/core';
import { FusionTrioTableComponent } from '../../compendium/components/fusion-trio-table.component';
import { TripleFissionTableComponent } from '../../compendium/components/tri-fission-table.component';
import { FusionDataService } from '../fusion-data.service';

@Component({
  imports: [FusionTrioTableComponent],
  template: `
    <app-fusion-trio-table
      [title]="'Ingredient 1 x Ingredient 2 x Ingredient 3 = ' + currentDemon$()"
      [getNotes]="getNotes$()"
      [raceOrder]="chart$().normalChart.raceOrder"
      [rowData]="fissionTrios$()"
      [inGameCurrencySymbol]="compendium$().inGameCurrencySymbol">
    </app-fusion-trio-table>
  `
})
export class NesTripleFissionTableComponent extends TripleFissionTableComponent {
  fusionTrioService = inject(FusionDataService);

  getNotes$ = computed(() => {
    const comp = this.compendium$();
    const compConfig = this.fusionTrioService.compConfig;
    const result = comp.getDemon(this.currentDemon$());
    const canInherit = result && compConfig.inheritSkills.length > 0;
    return canInherit ? (demon1: string, demon2: string, demon3: string) => compConfig.getInheritSkills(
      result,
      [comp.getDemon(demon1), comp.getDemon(demon2), comp.getDemon(demon3)],
      compConfig
    ).join(', ') || '-' : null;
  });
}
