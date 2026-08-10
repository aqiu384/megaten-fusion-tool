import { Component, computed, inject } from '@angular/core';
import { FusionTrioTableComponent } from '../../compendium/components/fusion-trio-table.component';
import { TripleFusionTableComponent } from '../../compendium/components/tri-fusion-table.component';
import { FusionDataService } from '../fusion-data.service';

@Component({
  imports: [FusionTrioTableComponent],
  template: `
    @let compendium = compendium$();
    @let chart = chart$();
    @let currentDemon = currentDemon$();
    @let fusionTrios = fusionTrios$();
    <app-fusion-trio-table
      [title]="'Result = Lvl ' + compendium.getDemon(currentDemon).currLvl + ' ' + currentDemon +  ' x Ingredient 2 x Ingredient 3'"
      [getNotes]="getNotes$()"
      [raceOrder]="chart.normalChart.raceOrder"
      [leftHeader]="'Result'"
      [rowData]="fusionTrios"
      [inGameCurrencySymbol]="compendium.inGameCurrencySymbol">
    </app-fusion-trio-table>
  `
})
export class NesTripleFusionTableComponent extends TripleFusionTableComponent {
  fusionTrioService = inject(FusionDataService);

  getNotes$ = computed(() => {
    const comp = this.compendium$();
    const compConfig = this.fusionTrioService.compConfig;
    const result = comp.getDemon(this.currentDemon$());
    const canInherit = result && compConfig.inheritSkills.length > 0;
    return canInherit ? (demon1: string, demon2: string, demon3: string) => compConfig.getInheritSkills(
      comp.getDemon(demon3),
      [result, comp.getDemon(demon1), comp.getDemon(demon2)],
      compConfig
    ).join(', ') || '-' : null;
  });
}
